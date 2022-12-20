import * as dotenvSafe from "dotenv-safe"
dotenvSafe.config({ allowEmptyValues: true })

import { Command } from "commander"
import { promises as fs } from "fs"
import { translateMuiPage, translateMuiStrings } from "./mui/translate"
import { findMuiFiles } from "./mui/files"
import { join } from "path"

const program = new Command()

program.name("translate").description("CLI for translating docs")

// MUI commands

const mui = program.command("mui").description("Translate MUI docs")

mui
  .command("repo")
  .description("Translate the whole material-ui repo")
  .argument("<path>", "Path to material-ui repo")
  .argument(
    "[dirs...]",
    "Globs specifying which directories to translate (defaults to all)",
    []
  )
  .option(
    "--no-translate",
    "Parse and render, but don't translate; useful for debugging"
  )
  .action(async (repo: string, dirs: string[], options) => {
    let files = findMuiFiles(repo, dirs)
    for (let path of files.pages) {
      console.log(`Translating ${path}`)
      let fullPath = join(repo, path)
      let content = (await fs.readFile(fullPath)).toString()
      let translated = await translateMuiPage(content, options)
      await fs.writeFile(fullPath, translated)
    }
    if (files.translationsJson && options.translate) {
      console.log(`Translating ${files.translationsJson}`)
      let fullPath = join(repo, files.translationsJson)
      let json = JSON.parse((await fs.readFile(fullPath)).toString())
      let translated = await translateMuiStrings(json)
      await fs.writeFile(fullPath, JSON.stringify(translated, null, 2))
    }
  })

mui
  .command("page <path>")
  .description("Translate a single page")
  .option("--no-translate", "Parse and render, but don't translate")
  .option("-i --inplace", "Overwrite the input file")
  .action(async (path, options) => {
    let content = (await fs.readFile(path)).toString()
    let translated = await translateMuiPage(content, options)
    if (options.inplace) {
      await fs.writeFile(path, translated)
    } else {
      process.stdout.write(translated)
    }
  })

mui
  .command("strings <path>")
  .description("Translate a translations.json file")
  .option("-i --inplace", "Overwrite the input file")
  .action(async (path, options) => {
    let json = JSON.parse((await fs.readFile(path)).toString())
    let translated = await translateMuiStrings(json)
    if (options.inplace) {
      await fs.writeFile(path, JSON.stringify(translated, null, 2))
    } else {
      process.stdout.write(JSON.stringify(translated, null, 2))
    }
  })

program.parse()
