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
    .filter((v) => filterByPartial(filterConfig, v))

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
  const amountWrongGuesses = learnable.lastGuesses.filter((g) => !g).length

  return amountWrongGuesses <= (filter.maxAmountWrongGuesses ?? 0)
}

const filterByNewerThanOneDay = (
  filter: LearnablesFilterConfig,
  learnable: Learnable
): boolean => {
  if (filter.age !== 'newerThanOneDay') return true
  return newerThanOneDay(new Date(learnable.created))
}

const filterByPartial = (
  filter: LearnablesFilterConfig,
  learnable: Learnable
): boolean => {
  if (!filter.partial) return true
  const lexeme = learnable.lexeme.toLowerCase()
  const translation = learnable.translation.toLowerCase()
  const partial = filter.partial.toLowerCase()
  return lexeme.includes(partial) || translation.includes(partial)
}

// #region Sort Functions

const sortLearnables = (
  filter: LearnablesFilterConfig,
  learnables: Learnable[]
): Learnable[] => {
  let sortedLearnables: Learnable[] = [...learnables]

  if (filter.orderBy === 'lexeme') {
    sortedLearnables = sortedLearnables.sort(orderByLexeme)
  } else if (filter.orderBy === 'wrongGuesses') {
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
  const aWrong = a.lastGuesses.filter((g) => !g).length
  const bWrong = b.lastGuesses.filter((g) => !g).length
  return aWrong - bWrong
}

const orderByRandom = (a: Learnable, b: Learnable): number => {
  return Math.random() - 0.5
}
