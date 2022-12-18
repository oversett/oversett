# Generate training data based on MUI docs

import spacy
from spacy.tokens import DocBin

# Load the training data and create the training examples

# TODO actually load from MUI docs
TRAINING_DATA = [
    ("The value state with the value/onChange props combination. This state represents the value selected by the user, for instance when pressing Enter.", [(25, 30, "CODE"), (31, 39, "CODE")]),
]

nlp = spacy.blank("en")

# the DocBin will store the example documents
db = DocBin()
for text, annotations in TRAINING_DATA:
    doc = nlp(text)
    ents = []
    for start, end, label in annotations:
        span = doc.char_span(start, end, label=label)
        ents.append(span)
    ents = [e for e in ents if e is not None]
    doc.ents = ents    # type: ignore
    db.add(doc)
db.to_disk("./train.spacy")