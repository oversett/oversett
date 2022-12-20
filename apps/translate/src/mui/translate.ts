// MUI uses 'marked' to render Markdown, see https://github.com/mui/material-ui/blob/master/packages/markdown/parseMarkdown.js.
//
// Deepl supports translating HTML but not Markdown, so we need to do a round-trip.

import * as deepl from "deepl-node"
import { showDiff } from "../utils/diff"
import {
  getHeaders,
  extractHeaders,
  removeHeaders,
  renderHeaders,
} from "./headers"
import { markdownToDeeplHtml, deeplHtmlToMarkdown } from "./markdown"
import { processMuiStrings } from "./strings"

const deeplApiKey = process.env.DEEPL_API_KEY!
const translator = new deepl.Translator(deeplApiKey)

/** Translate a single .md doc */
export async function translateMuiPage(
  markdown: string,
  options?: {
    translate?: boolean // If false, don't translate, just do a rountrip
  }
): Promise<string> {
  let headers = getHeaders(markdown)
  let content = removeHeaders(markdown)

  let defaultOptions = { translate: true }
  let { translate } = { ...defaultOptions, ...options }

  // Sanity check: are 'getHeaders' and 'renderHeaders' inverses?
  if (renderHeaders(headers as any) !== extractHeaders(markdown)) {
    process.stderr.write(
      "Headers are not rendered correctly: \n\n" +
        showDiff(renderHeaders(headers as any), extractHeaders(markdown))
    )
    process.exit(1)
  }

  const html = markdownToDeeplHtml(content)

  const translatedHtml = translate
    ? await translator.translateText(html, "en", "ru", {
        tagHandling: "html",
      })
    : { text: html }
  const translatedMarkdown = deeplHtmlToMarkdown(translatedHtml.text)

  return `${renderHeaders(headers)}\n\n${translatedMarkdown}\n`
}

/** Translate the translations.json file */
export function translateMuiStrings(json: any): Promise<any> {
  return processMuiStrings(json, async (value) => {
    const translated = await translator.translateText(value, "en", "ru")
    return translated.text
  })
}
