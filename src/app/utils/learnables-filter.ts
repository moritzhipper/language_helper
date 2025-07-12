import { Learnable, LearnablesFilterConfig } from '../types_and_schemas/types'

export const newerThanOneDay = (date: Date): boolean => {
  return new Date(date).getTime() > Date.now() - 24 * 60 * 60 * 1000
}

export const filterLearnables = (
  learnables: Learnable[],
  filterConfig: LearnablesFilterConfig
): Learnable[] => {
  const filtered = learnables
    .filter((v) => filterByType(filterConfig, v))
    .filter((v) => filterByAmountWrongGuesses(filterConfig, v))
    .filter((v) => filterByNewerThanOneDay(filterConfig, v))
    .filter((v) => filterBySearch(filterConfig, v))

  return sortLearnables(filterConfig, filtered)
}

// #region Filter Functions
const filterByType = (
  filter: LearnablesFilterConfig,
  learnable: Learnable
): boolean => {
  if (filter.type === 'all') return true
  return learnable.type === filter.type
}

const filterByAmountWrongGuesses = (
  filter: LearnablesFilterConfig,
  learnable: Learnable
): boolean => {
  const wrongGuesses = [
    ...learnable.guesses.lexeme,
    ...learnable.guesses.translation
  ].filter((g) => !g).length

  if (filter.confidence === 'high') return wrongGuesses < 1
  if (filter.confidence === 'medium') return wrongGuesses < 3
  return true
}

const filterByNewerThanOneDay = (
  filter: LearnablesFilterConfig,
  learnable: Learnable
): boolean => {
  if (filter.age !== 'newerThanOneDay') return true
  return newerThanOneDay(new Date(learnable.created))
}

const filterBySearch = (
  filter: LearnablesFilterConfig,
  learnable: Learnable
): boolean => {
  if (!filter.search) return true
  const lexeme = learnable.lexeme.toLowerCase()
  const translation = learnable.lexeme.toLowerCase()
  const search = filter.search.toLowerCase()
  return lexeme.includes(search) || translation.includes(search)
}

// #region Sort Functions

const sortLearnables = (
  filter: LearnablesFilterConfig,
  learnables: Learnable[]
): Learnable[] => {
  let sortedLearnables: Learnable[] = [...learnables]

  if (filter.orderBy === 'lexeme') {
    sortedLearnables = sortedLearnables.sort(orderByLexeme)
  } else if (filter.orderBy === 'confidence') {
    sortedLearnables = sortedLearnables.sort(orderByLastGuesses)
  } else if (filter.orderBy === 'random') {
    sortedLearnables = sortedLearnables.sort(orderByRandom)
  } else {
    sortedLearnables = sortedLearnables.sort(orderByDate)
  }

  if (filter.order === 'desc') return sortedLearnables.reverse()

  return sortedLearnables
}

const orderByDate = (a: Learnable, b: Learnable): number => {
  const dateA = new Date(a.created).getTime()
  const dateB = new Date(b.created).getTime()

  return dateB - dateA
}

const orderByLexeme = (a: Learnable, b: Learnable): number => {
  return a.lexeme.localeCompare(b.lexeme)
}

const orderByLastGuesses = (a: Learnable, b: Learnable): number => {
  const aWrong = a.guesses.lexeme.filter((g) => !g).length
  const bWrong = b.guesses.lexeme.filter((g) => !g).length
  return aWrong - bWrong
}

const orderByRandom = (a: Learnable, b: Learnable): number => {
  return Math.random() - 0.5
}
