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
  .option("-i --inplace", "Overwrite the input file")
  .action(async (file: string, options) => {
    let content = (await fs.readFile(file)).toString()
    let translated = await translateMui(content, options)
    if (options.inplace) {
      await fs.writeFile(file, translated)
    } else {
      process.stdout.write(translated)
    }
  })

program.parse()
