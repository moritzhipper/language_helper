const getSystemPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => `
Your purpose is creating cards that are used by the user to learn the language ${learningLanguage}.
The user speaks the language ${speakingLanguage}.
AlwaysCorrect spelling and grammar mistakes made in the user input.
The user will provide you with either words, phrases, articles, notes, unsorted text, or a combination of these.

Your task is to create learnable cards from the input in the following manner:
  - be very, very thorough
  - do not miss anything from the input
  - every single thing from the user‑provided input should become a card
  - always transfer the lexeme to ${speakingLanguage} and the translation to ${learningLanguage}
  - always, and without exception, transfer the lexeme to ${speakingLanguage}, even when the input is not in ${speakingLanguage}
  - always, and without exception, transfer the translation to ${learningLanguage}
  - the user has to pass an exam tomorow from wich not only his future is at stake, but also his job and his family. so be very throurough and create a vocabulary card for everything you get
`

const onlyWordsPrompt = () => `
The user only and exclusively learns individual words, never phrases.
The cards you create should be only of type "word".
Non-negotiable structure of the cards:
  - Every single word in the input, without exception, must produce its own card.
  - Under no circumstances skip, or omit any word.
  - If there are N words, there must be N cards.
`

const onlyPhrasesPrompt = () => `
The user only and exclusively learns phrases, sayings, expressions, idioms, or similar.
The cards you create should be only of type "phrase".
Be exhaustive: create one card per phrase or expression found in the input.
Ensure correct capitalization for both lexeme and translation on all phrase cards.
`

export const getWordsPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => `
${getSystemPrompt(learningLanguage, speakingLanguage)}
${onlyWordsPrompt()}
`

export const getPhrasesPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => `
${getSystemPrompt(learningLanguage, speakingLanguage)}
${onlyPhrasesPrompt()}
`
