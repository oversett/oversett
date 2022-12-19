"""
Generates training data based on MUI docs.

Usage:
  gen_train.py MUI_PATH

"""

import glob
import json
import random
import regex
import spacy
import os
import spacy.symbols
from spacy.tokens import DocBin
from docopt import docopt

from functions import retokenize_punctuation

from spacy import displacy


THRESHOLD = 1  # Remove backticks in 100% of cases (e.g. 0.3 = 30% of cases)
MAX_LENGTH = 30  # Ignore inline code longer than 30 characters


def create_training(content, threshold=THRESHOLD, max_length=MAX_LENGTH):
    """Create training data from a markdown file"""
    spans = []
    content_ = ""
    for index, x in enumerate(
        # Explanation:
        #   * up to max_length characters that aren't newlines or backticks
        #   * located between backticks
        #   * not preceded or followed by a letter or number
        #   * and there should be no spaces between the backticks and the code
        regex.split(
            rf"(?<![\d\p{{Letter}}])`(?! )([^\n`]{{1,{max_length}}})(?<! )`(?![\d\p{{Letter}}])",
            content,
        )
    ):
        if index % 2 == 0:
            content_ += x
        elif random.random() > threshold:
            content_ += "`" + x + "`"
        else:
            spans.append((len(content_), len(content_) + len(x), "CODE"))
            content_ += x
    return content_, spans


def annotate_doc(text, annotations, file=""):
    nlp = spacy.blank("en")
    doc = nlp(text)

    # https://github.com/explosion/spaCy/issues/11989
    doc = retokenize_punctuation(doc)

    ents = []
    for start, end, label in annotations:
        span = doc.char_span(start, end, label=label)
        if span is None:
            raise ValueError(
                f"""
                Invalid entity span [{start},{end}): '{text[start:end]}' ({file})
                    doc = {doc}
                    tokens = {json.dumps(list(map(lambda token: token.text, doc)))}
                """
            )
        ents.append(span)
    doc.ents = ents  # type: ignore
    return doc


def main():
    args = docopt(__doc__)
    mui = args["MUI_PATH"]

    # Create training and validation examples
    TRAINING_DATA = []
    VALIDATION_DATA = []
    for file in glob.glob(os.path.join(mui, "docs/data/**/*.md"), recursive=True):
        if "-pt.md" in file or "-zh.md" in file:
            continue
        print("Processing", os.path.relpath(file, mui))
        with open(file, "r") as f:
            text = f.read()
            if random.random() < 0.5:
                TRAINING_DATA.append((*create_training(text), file))
            else:
                VALIDATION_DATA.append((*create_training(text), file))

    # The DocBin will store the example documents
    db_training = DocBin()
    for text, annotations, file in TRAINING_DATA:
        doc = annotate_doc(text, annotations, file=file)
        db_training.add(doc)
        # displacy.serve(doc, style="ent", port=7070)
    db_training.to_disk("./train.spacy")

    db_validation = DocBin()
    for text, annotations, file in VALIDATION_DATA:
        doc = annotate_doc(text, annotations, file=file)
        db_validation.add(doc)
        # displacy.serve(doc, style="ent", port=7070)
    db_validation.to_disk("./dev.spacy")


def test():
    # create_training
    result = create_training("This is a `test`", threshold=1, max_length=30)
    assert result == (
        "This is a test",
        [(10, 14, "CODE")],  # NB: spans are [start, end)
    ), f"Wrong result: {result}"

    # annotate_doc
    annotate_doc("the [@mui/system](/link) documentation", [(5, 16, "CODE")])


if __name__ == "__main__":
    test()
    main()
