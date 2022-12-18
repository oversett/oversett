# code_ner

A model that does Named Entity Recognition (NER) on pieces of code in MUI docs.

Specifically, it tries to detect pieces of inline code (React prop names, etc) that should have been in backticks but for some reason aren't.

## Commands 

Config generation (use https://spacy.io/usage/training for the base config):

```
python -m spacy init fill-config base_config.cfg config.cfg
```

Generating `train.spacy`:

```
python gen_train.py
```

Training:

```
python -m spacy train config.cfg --output ./output --paths.train ./train.spacy --paths.dev ./train.spacy
```