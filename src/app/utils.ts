import { Learnable, LearnablesFilterConfig } from './types_and_schemas/types'

export const filterLearnables = (
  learnables: Learnable[],
  filterConfig: LearnablesFilterConfig
): Learnable[] => {
  const filtered = learnables
    .filter((v) => filterByType(filterConfig, v))
    .filter((v) => filterByAmountWrongGuesses(filterConfig, v))

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
  if (!filter.minAmountTrueGuesses) return true
  const amountTrueGuesses = learnable.lastGuesses.filter((g) => g).length

  return amountTrueGuesses >= filter.minAmountTrueGuesses
}

// #region Sort Functions

const sortLearnables = (
  filter: LearnablesFilterConfig,
  learnables: Learnable[]
): Learnable[] => {
  let sortedLearnables: Learnable[] = [...learnables]

  if (filter.orderBy === 'lexeme') {
    sortedLearnables = sortedLearnables.sort(orderByLexeme)
  } else if (filter.orderBy === 'trueGuesses') {
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

  return dateA - dateB
}

const orderByLexeme = (a: Learnable, b: Learnable): number => {
  return a.lexeme.localeCompare(b.lexeme)
}

const orderByLastGuesses = (a: Learnable, b: Learnable): number => {
  const aWrong = a.lastGuesses.filter((g) => !g).length
  const bWrong = b.lastGuesses.filter((g) => !g).length
  return bWrong - aWrong
}

const orderByRandom = (a: Learnable, b: Learnable): number => {
  return Math.random() - 0.5
}
