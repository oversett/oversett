import * as dotenvSafe from "dotenv-safe"
dotenvSafe.config({ allowEmptyValues: true })

import { Command } from "commander"
import { promises as fs } from "fs"
import { translateMui } from "./mui/translate"

const program = new Command()

program.name("translate").description("CLI for translating docs")

program
  .command("mui")
  .description("Translate MUI docs")
  .argument("<file>", "File to translate")
  .option("--no-translate", "Parse and render, but don't translate")
  .action(async (file: string, options) => {
    let content = (await fs.readFile(file)).toString()
    console.log(await translateMui(content, options))
  })

program.parse()
