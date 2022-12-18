# _Oversett_ — Translate all the docs

We are translating web development documentation (e.g. [MUI](https://mui.com)) into Russian, and later maybe other languages.

This is used primarily to teach web development to people who can't speak fluent English. See [webdev.artyom.me](https://webdev.artyom.me) for the details.

## How to run locally

- `yarn install`
- `cp .env.example .env` and fill in the values
- `yarn translate` and other commands should work now

To translate the entire material-ui repository:

```
find ../../material-ui/docs/data -name "*.md" ! -name "*-pt.md" ! -name "*-zh.md" -exec bash -c 'echo "$0"; yarn translate mui --inplace "$0"' {} \;
```
