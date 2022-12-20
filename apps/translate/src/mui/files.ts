import { glob } from "glob"
import path, { relative } from "path"

/** Find files to translate in a MUI repo.
 *
 * @param repo Path to the MUI repo
 *
 * @param dirs Optional globs specifying which directories to translate (defaults to all). The globs will be applied to both the .md files and the translations.json file. For example:
 *
 *   - `"system"` will include files in `docs/data/system`
 *   - `"translations"` will include the `docs/translations/translations.json` file.
 *
 * @returns an object with two properties: `pages` and `translationsJson`.
 */
export function findMuiFiles(
  repo: string,
  dirs?: string[]
): {
  pages: string[] // Markdown files
  translationsJson: string | null // translations.json
} {
  let docs = []
  if (dirs && dirs.length > 0) {
    for (let dir of dirs) {
      docs.push(
        ...glob.sync(`${dir}/**/*.md`, {
          cwd: path.join(repo, "docs/data"),
          absolute: true,
        })
      )
    }
  } else {
    docs.push(
      ...glob.sync("**/*.md", {
        cwd: path.join(repo, "docs/data"),
        absolute: true,
      })
    )
  }

  let translationsJson =
    dirs?.includes("translations") || dirs?.length === 0
      ? "docs/translations/translations.json"
      : null

  return {
    pages: docs
      .filter((file) => !path.basename(file).match(/-(zh|pt)\.md$/))
      .map((file) => relative(repo, file)),
    translationsJson,
  }
}
