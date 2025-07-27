/**
 * Removes the words from the user input that are in excludeWords array.
 * returns a list of new and unique words from the user input.
 *
 * @param userInput
 * @param learnables
 * @returns list of new and unique words
 */
export const mapAndFilterWordsFromInput = (
  userInput: string,
  excludeWords: string[]
): string[] => {
  const wordsDelimiters = /[ \n.,]+/g

  const allExistingWords = excludeWords.map((w) => w.toLowerCase())
  const allExistingWordsSet = new Set(allExistingWords)

  const userInputWords = userInput
    .split(wordsDelimiters)
    .filter((w) => w.length > 0)
    .map((w) => w.toLowerCase())
  const userInputWordsSet = new Set(userInputWords)

  const uniqueFilteredNewWords = [...userInputWordsSet].filter(
    (w) => !allExistingWordsSet.has(w)
  )

  return uniqueFilteredNewWords
}

export const splitArrayIntoBatches = <T>(
  array: T[],
  batchSize: number
): T[][] => {
  const numberOfChunks = Math.ceil(array.length / batchSize)
  const chunks: T[][] = []

  for (let i = 0; i < numberOfChunks; i++) {
    const chunkStart = i * batchSize
    const chunkEnd = (i + 1) * batchSize

    chunks.push(array.slice(chunkStart, chunkEnd))
  }

  return chunks
}

/**
 * Maps and filters phrases from user input into chunks.
 * Each chunk will not exceed the maxChunkSize.
 * The phrases are split by sentences or new lines.
 *
 * @param userInput The user input string.
 * @param maxChunkSize The maximum size of each chunk.
 * @returns An array of phrase chunks
 */
export const mapPhrasesFromInputToChunks = (
  userInput: string,
  maxChunkSize: number
): string[] => {
  const chunks: string[] = []
  const parts = userInput.split(/([.\n])/).filter((part) => part.trim())
  let currentChunk = ''

  for (const part of parts) {
    const withPart = currentChunk + part

    if (withPart.length <= maxChunkSize) {
      currentChunk = withPart
    } else {
      if (currentChunk) chunks.push(currentChunk)
      currentChunk = part
    }
  }
  if (currentChunk) chunks.push(currentChunk)
  return chunks
}
