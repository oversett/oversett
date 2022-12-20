export async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let stream = process.stdin
    let input = ""
    stream.on("data", (data) => (input += data))
    stream.on("end", () => resolve(input))
    stream.on("error", (err) => reject(err))
  })
}
