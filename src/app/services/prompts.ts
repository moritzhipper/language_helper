import { ResponseInputItem } from 'openai/resources/responses/responses.mjs'

export const getSystemPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => {
  const content = `Your are a language learning assistant. I speak the language ${speakingLanguage} and I am learning the language ${learningLanguage}. \n`
  return mapToSystemPrompt(content)
}

export const getCreateLearnablesPrompt = (
  excludeWords: string[],
  allowWords: boolean,
  allowPhrases: boolean
) => {
  const mappedExcluded = excludeWords.join(', ')
  let content = `
    Format the following unformatted text into a list of learnables. 
    Do not under any circumstances create learnables for the following words: ${mappedExcluded}.
    Write all words but names of people and locations in lowercase.`

  if (!allowWords) {
    content += `\n Only create learnables of type "phrase". Do not, under no circumstances, create learnables of type "word".`
  }

  if (!allowPhrases) {
    content += `\n Only create learnables of type "word". Do not, under no circumstances, create learnables of type "phrase". `
  }

  return mapToSystemPrompt(content)
}

export const getUseInSentencePrompt = (word: string) => {
  const content = `Use the following word in a sentence: ${word}.`
  return mapToSystemPrompt(content)
}

const mapToSystemPrompt = (content: string): ResponseInputItem => ({
  role: 'system',
  content
})
