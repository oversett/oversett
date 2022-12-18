import { diffLines } from "diff"
import chalk from "chalk"

// Display colorful diff between two strings
export function showDiff(a: string, b: string): string {
  const diffResult = diffLines(a, b)
  let result = ""
  diffResult.forEach((part) => {
    const color = part.added
      ? chalk.green
      : part.removed
      ? chalk.red
      : chalk.gray
    result = result + color(part.value)
  })
  return result
}
