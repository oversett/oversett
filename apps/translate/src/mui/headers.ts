import _ from "lodash"

// Taken from https://github.com/mui/material-ui/blob/master/packages/markdown/parseMarkdown.js

const headerRegExp = /---[\r\n]([\s\S]*)[\r\n]---/
const headerKeyValueRegExp = /(.*?):[\r\n]?\s+(\[[^\]]+\]|.*)/g

// Extract headers (the block with "---" at the beginning) from Markdown.
//
// Note: we can't use the function from parseMarkdown.js verbatim because it
// sorts the 'components' array and parses JSON strings. We just want something dumb.
export function getHeaders(markdown: string): { [key: string]: string } {
  let headerMatch = markdown.match(headerRegExp)
  if (!headerMatch) return {}

  let header = headerMatch[1]

  try {
    let regexMatches
    const headers: { [key: string]: string } = {}
    // eslint-disable-next-line no-cond-assign
    while ((regexMatches = headerKeyValueRegExp.exec(header)) !== null) {
      const key = regexMatches[1]
      let value = regexMatches[2].replace(/(.*)/, "$1")
      headers[key] = value
    }
    return headers
  } catch (err: any) {
    throw new Error(
      `${err.message} in getHeader(markdown) with markdown: \n\n${header}`
    )
  }
}

// The following functions are not taken from MUI anymore

// Render headers back into Markdown. Should be the inverse of 'getHeaders'.
export function renderHeaders(headers: { [key: string]: string }): string {
  if (_.isEmpty(headers)) return ""
  return [
    "---",
    ...Object.entries(headers).map(([key, value]) => `${key}: ${value}`),
    "---",
  ].join("\n")
}

// Remove headers from Markdown content.
export function removeHeaders(markdown: string): string {
  return markdown.replace(headerRegExp, "")
}

// Get the headers block from Markdown content verbatim.
export function extractHeaders(markdown: string): string {
  const match = markdown.match(headerRegExp)
  return match ? match[0] : ""
}
