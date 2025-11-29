import {
  LearnablesFilterConfig,
  UserLearnable
} from '../types_and_schemas/types'

export const filterLearnables = (
  learnables: UserLearnable[],
  filterConfig: LearnablesFilterConfig
): UserLearnable[] => {
  let filteredLearnables: UserLearnable[] = [...learnables]

  if (filterConfig.type) {
    filteredLearnables = filterByType(filterConfig, filteredLearnables)
  }
  if (filterConfig.confidence) {
    filteredLearnables = filterByConfidence(filterConfig, filteredLearnables)
  }
  if (filterConfig.search) {
    filteredLearnables = filterBySearch(filterConfig, filteredLearnables)
  }
  if (filterConfig.ids) {
    filteredLearnables = filterByIDs(filterConfig, filteredLearnables)
  }
  if (filterConfig.age) {
    filteredLearnables = filterByAge(filterConfig, filteredLearnables)
  }

  return sortLearnables(filterConfig, filteredLearnables)
}

const sortLearnables = (
  filter: LearnablesFilterConfig,
  learnables: UserLearnable[]
): UserLearnable[] => {
  let sortedLearnables: UserLearnable[] = [...learnables]

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

// #region Filter Functions
const filterByType = (
  filter: LearnablesFilterConfig,
  learnables: UserLearnable[]
): UserLearnable[] => {
  if (!filter.type) return learnables
  return learnables.filter((learnable) => learnable.type === filter.type)
}

const filterByConfidence = (
  filter: LearnablesFilterConfig,
  learnables: UserLearnable[]
): UserLearnable[] => {
  return learnables.filter((learnable) => {
    const wrongGuesses = getWrongGuesses(learnable)
    const isBetween = (min: number, max: number): boolean =>
      wrongGuesses >= min && wrongGuesses <= max

    if (filter.confidence === 'medium') return wrongGuesses > 4
    if (filter.confidence === 'low') return wrongGuesses > 6

    // case all
    return true
  })
}

const filterBySearch = (
  filter: LearnablesFilterConfig,
  learnables: UserLearnable[]
): UserLearnable[] => {
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
  learnables: UserLearnable[]
): UserLearnable[] => {
  if (!filterConfig.ids) return learnables
  return learnables.filter((learnable) =>
    filterConfig.ids!.includes(learnable.id)
  )
}

const filterByAge = (
  filter: LearnablesFilterConfig,
  learnables: UserLearnable[]
): UserLearnable[] => {
  if (!filter.age) return learnables
  if (filter.age === 'newest') {
    // Find the newest creation date
    const dates = learnables.map((learnable) =>
      new Date(learnable.created).getTime()
    )
    const newestDate = Math.max(...dates)

    // Return all learnables with that newest date
    return learnables.filter(
      (learnable) => new Date(learnable.created).getTime() === newestDate
    )
  }

  const now = Date.now()
  const oneDayInMs = 24 * 60 * 60 * 1000
  const maxAgeInDaysAsMs = (filter.age as number) * oneDayInMs

  return learnables.filter(
    (learnable) =>
      new Date(learnable.created).getTime() > now - maxAgeInDaysAsMs
  )
}

// #region Sort Functions

const orderByDate = (a: UserLearnable, b: UserLearnable): number => {
  const dateA = new Date(a.created).getTime()
  const dateB = new Date(b.created).getTime()

  return dateB - dateA
}

const orderByLexeme = (a: UserLearnable, b: UserLearnable): number => {
  return a.lexeme.localeCompare(b.lexeme)
}

const orderByConfidence = (a: UserLearnable, b: UserLearnable): number => {
  return getWrongGuesses(a) - getWrongGuesses(b)
}

const orderByRandom = (a: UserLearnable, b: UserLearnable): number => {
  return Math.random() - 0.5
}

const getWrongGuesses = (learnable: UserLearnable): number => {
  return [...learnable.guesses.lexeme, ...learnable.guesses.translation].filter(
    (g) => !g
  ).length
}
