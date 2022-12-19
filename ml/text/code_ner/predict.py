"""
Predict the code spans in the text, using the trained model.
"""

import spacy
import os
import sys

import functions


def get_script_path():
    return os.path.dirname(os.path.realpath(sys.argv[0]))


nlp = spacy.load(get_script_path() + "/output/model-best")

# Read the input text
text = sys.stdin.read()

# Use the NER model to classify the spans in the text
doc = nlp(text)

# Iterate through the entities in the document and replace the CODE entities with
# a version surrounded by backticks
output_text = ""
for token in doc:
    if token.ent_type_ == "CODE":
        output_text += "`" + token.text + "`" + token.whitespace_
    else:
        output_text += token.text_with_ws

# Output the text with the CODE spans surrounded by backticks
print(output_text)
