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
  const wrongGuesses = getWrongGuesses(learnable)
  const isBetween = (min: number, max: number): boolean =>
    wrongGuesses >= min && wrongGuesses <= max

  if (filter.confidence === 'high') return isBetween(0, 1)
  if (filter.confidence === 'medium') return isBetween(2, 4)
  if (filter.confidence === 'low') return wrongGuesses >= 5
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
    sortedLearnables = sortedLearnables.sort(orderByConfidence)
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

const orderByConfidence = (a: Learnable, b: Learnable): number => {
  console.log(getWrongGuesses(a))
  return getWrongGuesses(a) - getWrongGuesses(b)
}

const orderByRandom = (a: Learnable, b: Learnable): number => {
  return Math.random() - 0.5
}

const getWrongGuesses = (learnable: Learnable): number => {
  return [...learnable.guesses.lexeme, ...learnable.guesses.translation].filter(
    (g) => !g
  ).length
}
