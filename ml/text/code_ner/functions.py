"""
Functions and components used by the model, training process, etc.

See https://spacy.io/usage/training#custom-functions for more details.
"""

from spacy.language import Language
import regex


@Language.component("retokenize_punctuation", retokenizes=True)
def retokenize_punctuation(doc):
    with doc.retokenize() as retokenizer:
        for token in doc:
            # delim = r"""([\{\}\[\]\(\)/`.:,;#?!&$<>="'－])"""
            delim = r"""([\p{Punctuation}])"""
            if regex.search(delim, token.text):
                split = list(
                    filter(lambda s: len(s) > 0, regex.split(delim, token.text))
                )
                retokenizer.split(token, split, heads=[token] * len(split))
    return doc
