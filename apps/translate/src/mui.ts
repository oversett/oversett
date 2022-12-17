// MUI uses 'marked' to render Markdown, see https://github.com/mui/material-ui/blob/master/packages/markdown/parseMarkdown.js.
//
// Deepl supports translating HTML but not Markdown, so we need to do a round-trip.

import * as deepl from "deepl-node"
import { marked } from "marked"
import TurndownService from "turndown"

const deeplApiKey = process.env.DEEPL_API_KEY!
const translator = new deepl.Translator(deeplApiKey)

const turndownService = new TurndownService()

export async function translateMui(markdown: string): Promise<string> {
  const html = marked(markdown)
  const translatedHtml = await translator.translateText(html, "en", "ru", {
    tagHandling: "html",
  })
  console.log(translatedHtml.text.slice(0, 100))
  const translatedMarkdown = turndownService.turndown(translatedHtml.text)
  return translatedMarkdown
}
