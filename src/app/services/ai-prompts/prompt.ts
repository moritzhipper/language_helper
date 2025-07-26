const getSystemPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => `
Your purpose is creating cards that are used by the user to learn the language ${learningLanguage}.
The user speaks the language ${speakingLanguage}.
Correct spelling and grammar mistakes made in the user input.
The user will provide you with either words, phrases, articles, notes, unsorted text, or a combination of these.

Your task is to create learnable cards from the input in the following manner:
- be very, very thorough
- do not miss anything from the input
- every single thing from the user‑provided input should become a card
- always transfer the lexeme to ${learningLanguage} and the translation to ${speakingLanguage}
- the usesr has to pass an exam tomorow from wich not only his future is at stake, but also his job and his family. So be very throurough and create a vocabulary card for everything you get
`

const onlyWordsPrompt = () => `
The user only and exclusively learns individual words, never phrases.
The cards you create should be only of type "word".
COMICALLY CRYSTAL-CLEAR REQUIREMENT:
- Every single word in the input, without exception, must produce its own card.
- Under no circumstances skip, merge, group, or omit any word.
- If there are N words, there must be N cards.
`

const onlyPhrasesPrompt = () => `
The user only and exclusively learns phrases, sayings, expressions, idioms, or similar.
The cards you create should be only of type "phrase".
Be exhaustive: create one card per phrase or expression found in the input.
Ensure correct capitalization for both lexeme and translation on all phrase cards.
`

const wordsAndPhrasesPrompt = () => `
The user wants to learn both words and phrases.
Create "word" cards for each word and "phrase" cards for each multi‑word expression.
Be exhaustive: do not omit any words or expressions from the input.
For phrase cards, ensure correct capitalization for both lexeme and translation.
When the user gives you N words, you should create N cards.
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

export const getWordsAndPhrasesPrompt = (
  learningLanguage: string,
  speakingLanguage: string
) => `
${getSystemPrompt(learningLanguage, speakingLanguage)}
${wordsAndPhrasesPrompt()}
`
