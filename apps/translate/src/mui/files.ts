import { glob } from "glob"
import path, { relative } from "path"

/** Find files to translate in a MUI repo.
 *
 * @returns an array of paths to files to translate, relative to the repo root.
 */
export function findMuiFiles(repo: string, dirs?: string[]): string[] {
  let files = []
  if (dirs && dirs.length > 0) {
    for (let dir of dirs) {
      files.push(
        ...glob.sync(`${dir}/**/*.md`, {
          cwd: path.join(repo, "docs/data"),
          absolute: true,
        })
      )
    }
  } else {
    files.push(
      ...glob.sync("**/*.md", {
        cwd: path.join(repo, "docs/data"),
        absolute: true,
      })
    )
  }
  return files
    .filter((file) => !path.basename(file).match(/-(zh|pt)\.md$/))
    .map((file) => relative(repo, file))
}
