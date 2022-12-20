# _Oversett_ — Translate all the docs

We are translating web development documentation (e.g. [MUI](https://mui.com)) into Russian, and later maybe other languages.

This is used primarily to teach web development to people who can't speak fluent English. See [webdev.artyom.me](https://webdev.artyom.me) for the details.

## Discord

**Do you want to request a new language? Or help with the translation? Join the `#oversett` channel at https://discord.gg/6Jp9mNBNgC.**

---

## File structure

- `apps/translate` — CLI tool for translation, written in TypeScript
- `ml/text/` — Machine learning models for text processing, written in Python
  - `./code_ner` — Named Entity Recognition model for detecting inline code in MUI docs _(not used at the moment)_

## How to run locally

### Setup

JavaScript:

- `yarn install`
- `cp .env.example .env` and fill in the values

Python **(not used at the moment)**:

- Install Anaconda, see https://www.anaconda.com/products/distribution
- Install `anaconda-project`: `conda install anaconda-project`
- Download dependencies: `cd ml/text && anaconda-project prepare`
- Enter the correct environment: `conda activate envs/default`

### Translation

#### MUI

You will need a patched version of the MUI repo. Clone it from https://github.com/oversett/mui-repo.

To translate the entire repo:

```
yarn translate mui repo ../mui-repo
```

To translate only a subset of the repo:

```
yarn translate mui repo ../mui-repo base/components/tabs   # can list multiple paths
```

To preview the translation (at http://localhost:3000):

```
cd ../mui-repo && yarn && yarn docs:dev
```
