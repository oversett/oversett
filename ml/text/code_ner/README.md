# code_ner

**This doesn't work yet.**

A lot of backticks added where they shouldn't be.

I can't fix it at the moment so this is abandoned for now.

---

A model that does Named Entity Recognition (NER) on pieces of code in MUI docs.

Specifically, it tries to detect pieces of inline code (React prop names, etc) that should have been in backticks but for some reason aren't.

## Commands

Config generation (use https://spacy.io/usage/training for the base config):

```
spacy init fill-config --code=functions.py base_config.cfg config.cfg
```

Generating `train.spacy` and `dev.spacy` (around 1min):

```
python gen_train.py path/to/material-ui
```

Training (takes around 35min on CPU):

```
spacy train config.cfg --code=functions.py --output ./output --paths.train ./train.spacy --paths.dev ./dev.spacy
```

Processing the entire material-ui repo:

```
find ~/code/material-ui/docs/data -name "*.md" ! -name "*-pt.md" ! -name "*-zh.md" -exec bash -c 'echo "$0"; cat "$0" | python predict.py > "$0.translated"; mv "$0.translated" "$0"' {} \;
```
