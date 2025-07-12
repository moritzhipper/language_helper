import { ResponseInputItem } from 'openai/resources/responses/responses.mjs'

export const getSystemPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => {
  const content = `Your are a language learning assistant. I speak the language ${speakingLanguage} and I am learning the language ${learningLanguage}. \n`
  return mapToSystemPrompt(content)
}

export const getCreateLearnablesPrompt = (
  learningLanguage: string,
  speakingLanguage: string,
  excludeWords: string[],
  allowWords: boolean,
  allowPhrases: boolean
) => {
  const mappedExcluded = excludeWords.join(', ')
  let content = `

    Transform any input text (article, notes, or word list) into a list of vocabulary entries with the structure:
      - lexeme: the original word or phrase (if necessary, transferred into the language I'm learning ${learningLanguage})
      - translation: the ${speakingLanguage} meaning 
      - notes: include part of speech, the base form (lemma) if the lexeme is an inflected form, or any other specific info only if the form is very unusual or grammatically notable. If no such info applies, leave notes empty. Dont mention the translation here, only give info.

    Always detect the input language and assign it to x, and provide the translation in English as translation.
    Use correct upper and lower case spelling according to the rules of the source language, as if each word or phrase appeared on its own
    Do not under any circumstances create cards for the following words: ${mappedExcluded}.`

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
