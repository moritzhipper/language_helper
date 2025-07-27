const getSystemPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => `
Your purpose is creating cards that are used by the user to learn the language ${learningLanguage}.
The user speaks the language ${speakingLanguage}.

AlwaysCorrect spelling and grammar mistakes made in the user input.
The user will provide you with either words, phrases, articles, notes, unsorted text, or a combination of these.
The user has to pass an exam tomorow from wich not only his future is at stake, but also his job and his family. so be very throurough and create a vocabulary card for everything you get

Your task is to create learnable cards from the input in the following manner:
  - be very, very thorough
  - always, and without exception, transfer the input to ${speakingLanguage}, even when the input is not in ${speakingLanguage}
  - always, and without exception, transfer the translation to ${learningLanguage}
  - never ever create a card where the lexeme or word is in ${learningLanguage} and corresponding translation also is in ${learningLanguage}
  `

const wordsPrompt = () => `
The user only and exclusively learns individual words, never phrases.
The cards you create should be only of type "word".
`

const phrasesPrompt = () => `
The user only and exclusively learns phrases, sayings, expressions, idioms, or similar.
Be exhaustive: create one card per phrase or expression found in the input.
Ensure correct capitalization for both lexeme and translation on all phrase cards.
Never create a card for single words, only phrases.
`

export const getWordsPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => `
${getSystemPrompt(learningLanguage, speakingLanguage)}
${wordsPrompt()}
`

export const getPhrasesPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => `
${getSystemPrompt(learningLanguage, speakingLanguage)}
${phrasesPrompt()}
`
