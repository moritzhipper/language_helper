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
      - lexeme: the original word or phrase from the input (if necessary, transferred into the language I'm learning ${learningLanguage})
      - translation: the translation into ${speakingLanguage} 
      

    Do not comment the translation in any way.
    Be very thorough and precise in your analysis of the input text.
    Correct any grammatical or spelling errors in the input text.
    Use correct upper and lower case spelling according to the rules of the source language, as if each word or phrase appeared on its own
    Do not create learnables for words or phrases that are already in the vocabulary, which consists of the following words: ${mappedExcluded}.`

  if (!allowWords) {
    content += `\n Only create learnables of type "phrase". Extract phrases from the input one could say or use. 
      Do not, under no circumstances, create learnables of type "word".`
  }

  if (!allowPhrases) {
    content += `\n Only create learnables of type "word". Extract the words from this not already beein in the vocabulary.
      Do not, under no circumstances, create learnables of type "phrase".`
  }

  if (allowWords && allowPhrases) {
    content += `\n Create learnables of type "word" and "phrase". Be thourough, do not miss things.`
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
