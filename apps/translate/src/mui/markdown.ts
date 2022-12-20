import { marked } from "marked"
import TurndownService from "turndown"
// @ts-ignore
import { gfm } from "@joplin/turndown-plugin-gfm"
import * as cheerio from "cheerio"

// Render Markdown into HTML that would work well with Deepl
export function markdownToDeeplHtml(markdown: string): string {
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
          return `<div data-type="callout" data-severity="${
            token.severity
          }">${this.parser.parse(token.tokens!)}\n</div>`
        },
      },
    ],
  })

  const $ = cheerio.load(marked(markdown, markedOptions))

  // Don't translate inline code and code blocks
  $("code").attr("translate", "no")

  // Don't translate <kbd>
  $("kbd").attr("translate", "no")

  // Don't translate {{"demo": ...}} etc blocks
  $("p").each((_, el) => {
    let text = $(el).text()
    if (text.startsWith("{{") && text.endsWith("}}")) {
      $(el).attr("translate", "no")
    }
  })

  // For all headings, keep the original text as an attribute of an empty bogus element — we'll need it later so that MUI can use the original text when generating heading IDs
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const text = $(el).text()
    const meta = $("<meta data-oversett>")
    meta.attr("data-original-text", text)
    $(el).append(" ", meta)
  })

  return $.html()
}

// The inverse of 'markdownToDeeplHtml'
export function deeplHtmlToMarkdown(html: string): string {
  // Remove the translate="no" attributes
  const $ = cheerio.load(html)
  $("[translate=no]").removeAttr("translate")

  html = $.html()

  const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    br: "\\",
    // All unknown tags should be output as-is
    defaultReplacement: (content, node) => {
      return (node as Element).outerHTML
    },
  })

  // Enable GFM
  turndownService.use(gfm)

  // Handle ::: callout blocks
  turndownService.addRule("callout", {
    filter: (node) =>
      node.nodeName === "DIV" && node.getAttribute("data-type") === "callout",
    replacement: (content, node) => {
      const severity = (node as Element).getAttribute("data-severity")
      return `\n\n:::${severity}\n${content.trim()}\n:::\n\n`
    },
  })

  // Elements with classes (e.g. <p class="description">) should be output as-is
  turndownService.addRule("keep-classes", {
    filter: (node) => node.classList.length > 0,
    replacement: (content, node) => {
      return (node as Element).outerHTML
    },
  })

  // Links with extra attributes (e.g. <a href="..." target="_blank">) should be output as-is
  turndownService.addRule("keep-attributes", {
    filter: (node) =>
      node.nodeName === "A" &&
      Array.from(node.attributes).some((attr) => attr.name !== "href"),
    replacement: (content, node) => {
      return (node as Element).outerHTML
    },
  })

  // For images, we can only output src and alt. If <img> has anything else, we output it as-is.
  turndownService.addRule("img", {
    filter: (node) => {
      const supportedAttr = (name: string) => name === "src" || name === "alt"
      return (
        node.nodeName === "IMG" &&
        !Array.from(node.attributes).every((attr) => supportedAttr(attr.name))
      )
    },
    replacement: (content, node) => {
      return (node as Element).outerHTML
    },
  })

  return turndownService.turndown(html)
}
