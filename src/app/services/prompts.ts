import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

export const getSystemPrompt = (
  learningLanguage: string,
  speakingLanguage: string
): ChatCompletionMessageParam => {
  const content = `Your are a language learning assistant. I speak the language ${speakingLanguage} and I am learning the language ${learningLanguage}. \n`
  return mapToSystemPrompt(content)
}

export const getCreateLearnablesPrompt = (excludeWords: string[]) => {
  const mappedExcluded = excludeWords.join(', ')
  const content = `Format the following unformatted text into a list of learnables. Skip the following words, becaus they are already in the database of learnable words: ${mappedExcluded}.`
  return mapToSystemPrompt(content)
}

export const getUseInSentencePrompt = (word: string) => {
  const content = `Use the following word in a sentence: ${word}.`
  return mapToSystemPrompt(content)
}

const mapToSystemPrompt = (content: string): ChatCompletionMessageParam => ({
  role: 'system',
  content,
})
