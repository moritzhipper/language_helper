import { Learnable, LearnablesFilterConfig } from '../types_and_schemas/types'

export const newerThanDays = (date: Date, days: number): boolean => {
  return new Date(date).getTime() > Date.now() - days * 24 * 60 * 60 * 1000
}

export const filterLearnables = (
  learnables: Learnable[],
  filterConfig: LearnablesFilterConfig
): Learnable[] => {
  let filteredLearnables: Learnable[] = [...learnables]

  if (filterConfig.type && filterConfig.type !== 'all') {
    filteredLearnables = filterByType(filterConfig, filteredLearnables)
  }

  if (filterConfig.confidence && filterConfig.confidence !== 'all') {
    filteredLearnables = filterByConfidence(filterConfig, filteredLearnables)
  }

  if (filterConfig.search) {
    filteredLearnables = filterBySearch(filterConfig, filteredLearnables)
  }

  if (filterConfig.ids) {
    filteredLearnables = filterByIDs(filterConfig, filteredLearnables)
  }

  if (filterConfig.age && filterConfig.age !== 'all') {
    filteredLearnables = filterByNewerThanDays(filterConfig, filteredLearnables)
  }

  return sortLearnables(filterConfig, filteredLearnables)
}

// #region Filter Functions
const filterByType = (
  filter: LearnablesFilterConfig,
  learnables: Learnable[]
): Learnable[] => {
  if (filter.type === 'all') return learnables
  return learnables.filter((learnable) => learnable.type === filter.type)
}

const filterByConfidence = (
  filter: LearnablesFilterConfig,
  learnables: Learnable[]
): Learnable[] => {
  return learnables.filter((learnable) => {
    const wrongGuesses = getWrongGuesses(learnable)
    const isBetween = (min: number, max: number): boolean =>
      wrongGuesses >= min && wrongGuesses <= max

    if (filter.confidence === 'high') return wrongGuesses <= 1
    if (filter.confidence === 'medium') return isBetween(2, 5)
    if (filter.confidence === 'low') return isBetween(6, 10)

    // case all
    return true
  })
}

const filterBySearch = (
  filter: LearnablesFilterConfig,
  learnables: Learnable[]
): Learnable[] => {
  if (!filter.search) return learnables
  const search = filter.search.toLowerCase()
  return learnables.filter((learnable) => {
    const lexeme = learnable.lexeme.toLowerCase()
    const translation = learnable.translation.toLowerCase()
    return lexeme.includes(search) || translation.includes(search)
  })
}

const filterByIDs = (
  filterConfig: LearnablesFilterConfig,
  learnables: Learnable[]
): Learnable[] => {
  if (!filterConfig.ids) return learnables
  return learnables.filter((learnable) =>
    filterConfig.ids!.includes(learnable.id)
  )
}

const filterByNewerThanDays = (
  filter: LearnablesFilterConfig,
  learnables: Learnable[]
): Learnable[] => {
  if (filter.age === 'all' || !filter.age) return learnables
  if (filter.age === 'newest') {
    return learnables // or implement specific logic for newest
  }

  return learnables.filter((learnable) =>
    newerThanDays(new Date(learnable.created), filter.age as number)
  )
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
