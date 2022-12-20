/** MUI has a docs/translations/translations.json file that stores sidebar page titles (and some other strings).
 *
 * This function does something with the page titles.
 *
 * The structure of the JSON file is:
 *
 * ```json
 * {
 *     ...,
 *     "pages": {
 *         "/system/getting-started": "Getting started", ...
 *     }
 * }
 * ```
 */
export async function processMuiStrings(
  json: any,
  go: (titles: string[]) => Promise<string[]>
): Promise<any> {
  const pages = json.pages
  const titles = Object.keys(pages).map((key) => pages[key])
  const translated = await go(titles)
  for (let i = 0; i < translated.length; i++) {
    pages[Object.keys(pages)[i]] = translated[i]
  }
  return json
}
