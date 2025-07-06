import { ResponseInputItem } from 'openai/resources/responses/responses.mjs'

export const getSystemPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => {
  const content = `Your are a language learning assistant. I speak the language ${speakingLanguage} and I am learning the language ${learningLanguage}. \n`
  return mapToSystemPrompt(content)
}

export const getCreateLearnablesPrompt = (excludeWords: string[]) => {
  const mappedExcluded = excludeWords.join(', ')
  const content = `
    Format the following unformatted text into a list of learnables. 
    Do not under any circumstances create learnables for the following words: ${mappedExcluded}.
    Write all words but names of people and locations in lowercase.`
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
