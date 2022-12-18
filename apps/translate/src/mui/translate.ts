// MUI uses 'marked' to render Markdown, see https://github.com/mui/material-ui/blob/master/packages/markdown/parseMarkdown.js.
//
// Deepl supports translating HTML but not Markdown, so we need to do a round-trip.

import * as deepl from "deepl-node"
import { marked } from "marked"
import TurndownService from "turndown"
import { showDiff } from "../utils/diff"
import {
  getHeaders,
  extractHeaders,
  removeHeaders,
  renderHeaders,
} from "./headers"
import * as cheerio from "cheerio"

const deeplApiKey = process.env.DEEPL_API_KEY!
const translator = new deepl.Translator(deeplApiKey)

// Render Markdown into HTML that would work well with Deepl
function markdownToDeeplHtml(markdown: string): string {
  // Options used by MUI
  const markedOptions: marked.MarkedOptions = {
    gfm: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
  }

  marked.use({
    extensions: [
      // Taken from parseMarkdown.js. This handles ::: callout blocks.
      {
        name: "callout",
        level: "block",
        start(src) {
          const match = src.match(/:::/)
          return match ? match.index : undefined
        },
        tokenizer(src) {
          const rule =
            /^ {0,3}(:{3,}(?=[^:\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~:]* *(?=\n|$)|$)/
          const match = rule.exec(src)
          if (match) {
            const token = {
              type: "callout",
              raw: match[0],
              text: match[3].trim(),
              severity: match[2],
              tokens: [],
            }
            this.lexer.blockTokens(token.text, token.tokens)
            return token
          }
          return undefined
        },
        // Using <div> and data-severity instead of <aside> and specific classes
        renderer(token) {
          return `<div class="callout" data-severity="${
            token.severity
          }">${this.parser.parse(token.tokens!)}\n</div>`
        },
      },
    ],
  })

  const $ = cheerio.load(marked(markdown, markedOptions))

  // Don't translate inline code and code blocks
  $("code").attr("translate", "no")
  // Don't translate {{"demo": ...}} etc blocks
  $("p").each((_, el) => {
    let text = $(el).text()
    if (text.startsWith("{{") && text.endsWith("}}")) {
      $(el).attr("translate", "no")
    }
  })

  return $.html()
}

// The inverse of 'markdownToDeeplHtml'
function deeplHtmlToMarkdown(html: string): string {
  const turndownService = new TurndownService({ headingStyle: "atx" })
  turndownService.addRule("callout", {
    filter: (node) =>
      node.nodeName === "DIV" && node.classList.contains("callout"),
    replacement: (content, node) => {
      const severity = (node as Element).getAttribute("data-severity")
      return `:::${severity}\n${content.trim()}\n:::`
    },
  })
  return turndownService.turndown(html)
}

export async function translateMui(
  markdown: string,
  options?: {
    translate?: boolean
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

  return `${renderHeaders(headers as any)}\n\n${translatedMarkdown}`
}
