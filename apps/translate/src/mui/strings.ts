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
  f: (text: string) => Promise<string>
): Promise<any> {
  const pages = json.pages
  const promises = Object.keys(pages).map(async (page) => {
    const title = pages[page]
    if (title) {
      pages[page] = await f(title)
    }
  })
  await Promise.all(promises)
  return json
}
