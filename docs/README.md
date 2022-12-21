# Contributing to Oversett

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

- Install Anaconda, see <https://www.anaconda.com/products/distribution>
- Install `anaconda-project`: `conda install anaconda-project`
- Download dependencies: `cd ml/text && anaconda-project prepare`
- Enter the correct environment: `conda activate envs/default`

### Translation

#### MUI

You will need a patched version of the MUI repo. Clone it from <https://github.com/oversett/mui-repo>.

To translate the entire repo (NB: just the `docs/data/material` folder is about 300K chars, so free DeepL API quota is not enough to translate the whole repo):

```bash
yarn translate mui repo ../mui-repo
```

To translate only a subset of the repo:

```bash
yarn translate mui repo ../mui-repo base/components/tabs   # can list multiple paths
```

To preview the translation (at <http://localhost:3000>):

```bash
cd ../mui-repo && yarn && yarn docs:dev
```

To deploy the translation, you also need to clone <https://github.com/oversett/mui-translated>. Here is an example for the `ru` translation:

```bash
cd ..
rm -rf mui-translated/ru
cp -R mui-repo mui-translated/ru  # Assuming mui-repo is already translated locally
rm -rf mui-translated/ru/.git

cd mui-translated
git add -A && git commit -m "Update ru translation"
git push

# Netlify should deploy automatically but the build fails for some reason.
# You need 'netlify-cli' to do a manual deploy.
cd ru
yarn
netlify build
netlify deploy --prod
```
