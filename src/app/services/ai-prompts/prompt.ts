// mention both languages here. emphasize to always transfer to correct languages
const getSystemPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => `
Your purpuse is creating cards that are used by the user to learn the language ${learningLanguage}. 
The user speaks the language ${speakingLanguage}.
Correct spelling and grammar mistakes made in the user input.
The user will provide you with either words, phrases, articles, notes, unsorted text. or a combination of these.

Your task is to create learnable cards from the input in the following manner:
    - be very, very thoroughly
    - do not miss anything, from the input
    - every single thing from the user provided input should be found in a vocabulary card you create
    - no matter what the input language is, always transfer the lexeme to the language ${learningLanguage} and the translation to ${speakingLanguage}
`

const onlyWordsPrompt = () => `
The user only and exclusively learn words, never ever phrases
The cards you create should be as follows:
    - the returned cards should thus be only of type "word"
    - be very thourough, do not miss anything from the input. create a learnable for every single word
`

const onlyPhrasesPrompt = () => `
The user wants to learn phrases, sayings, expressions, idioms, or similar to get to know the language and how it is used better.
The user only and exclusively learn phrases, never ever words
The cards you create should thus be as follows:
    - the returned cards should thus be only of type "phrase"
    - be very thourough, do not miss anything from the input that may be important
`

const wordsAndPhrasesPrompt = () => `
The user wants to learn both words and phrases, sayings, expressions, idioms, or similar.
The cards you create should thus be as follows:
    - the returned cards should thus be of type "word" and "phrase"
    - be very thourough, do not miss anything from the input that may be important
    - create for every single word a learnable card of the type word
    - create for every single phrase a learnable card of the type phrase
`

export const getWordsPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => getSystemPrompt(learningLanguage, speakingLanguage) + onlyWordsPrompt()

export const getPhrasesPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => getSystemPrompt(learningLanguage, speakingLanguage) + onlyPhrasesPrompt()

export const getWordsAndPhrasesPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) =>
  getSystemPrompt(learningLanguage, speakingLanguage) + wordsAndPhrasesPrompt()
