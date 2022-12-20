import * as deepl from "deepl-node"

const deeplApiKey = process.env.DEEPL_API_KEY!
const translator = new deepl.Translator(deeplApiKey)

/** Translate a string with DeepL. */
export async function deeplTranslateRaw(text: string): Promise<string> {
  const translated = await translator.translateText(text, "en", "ru")
  return translated.text
}

/** Translate a piece of text with DeepL, preserving HTML tags. Elements with `translate="no"` will not be translated. */
export async function deeplTranslateHtml(html: string): Promise<string> {
  const translated = await translator.translateText(html, "en", "ru", {
    tagHandling: "html",
  })
  return translated.text
}
