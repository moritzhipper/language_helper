import {
  CollectionUser,
  Guess,
  Guessable,
  LearnableBase,
  LearnablesStoreType,
  UserLearnable
} from '../../types_and_schemas/types'
import { initialGuesses, updateActiveBank } from './mutator-utils'

// Helper to check if practice should be reset when cards are deleted
export const shouldResetPractice = (
  state: LearnablesStoreType,
  idsToDelete: string[]
): boolean =>
  state.currentPractice?.guessables.some((g) => idsToDelete.includes(g.id)) ??
  false

// Helper to remove learnables from the active bank
export const removeLearnablesFromBank = (
  state: LearnablesStoreType,
  idsToDelete: string[]
): LearnablesStoreType => {
  const updatedState = updateActiveBank((b) => ({
    ...b,
    learnables: b.learnables.filter((l) => !idsToDelete.includes(l.id)),
    collections: b.collections.map((c) => ({
      ...c,
      cardIds: c.cardIds.filter((cardId) => !idsToDelete.includes(cardId))
    }))
  }))(state)

  return {
    ...updatedState,
    currentPractice: shouldResetPractice(state, idsToDelete)
      ? null
      : state.currentPractice
  }
}

export const learnablesMatch = (l1: LearnableBase, l2: LearnableBase) =>
  l1.lexeme === l2.lexeme && l1.translation === l2.translation

export const mapBaseToFullToLearnables = (
  learnableBase: LearnableBase[]
): UserLearnable[] => {
  const now = new Date()
  return learnableBase.map((l) => ({
    id: crypto.randomUUID(),
    created: now,
    type: l.type,
    lexeme: l.lexeme,
    translation: l.translation,
    notes: l.notes,
    guesses: { ...initialGuesses }
  }))
}

export const addGuessToLearnable = (
  learnable: UserLearnable,
  isCorrect: boolean,
  reverseDirection: boolean
): UserLearnable => {
  const updateGuesses = (guesses: boolean[], isCorrect: boolean): boolean[] => [
    ...guesses.slice(1),
    isCorrect
  ]

  if (!reverseDirection) {
    return {
      ...learnable,
      guesses: {
        ...learnable.guesses,
        translation: updateGuesses(learnable.guesses.translation, isCorrect)
      }
    }
  } else {
    return {
      ...learnable,
      guesses: {
        ...learnable.guesses,
        lexeme: updateGuesses(learnable.guesses.lexeme, isCorrect)
      }
    }
  }
}

export const updateGuessables = (
  guessables: Guessable[],
  id: string,
  guessed: Guess
): Guessable[] => {
  return guessables.map((g) => (g.id === id ? { ...g, guessed } : g))
}

export const createNewCollection = (
  name: string,
  cardIds: string[]
): CollectionUser => ({
  id: crypto.randomUUID(),
  created: new Date(),
  name,
  cardIds
})

export const startPractice =
  (ids: string[], reverseDirection: boolean) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    // randomize order of ids to prevent memorization of order
    const randomizedGuessables: Guessable[] = [...ids]
      .sort(() => Math.random() - 0.5)
      .map((id) => ({
        id,
        guessed: 'unanswered'
      }))

    return {
      ...state,
      currentPractice: {
        guessables: randomizedGuessables,
        index: 0,
        reverseDirection
      }
    }
  }

export const setGuess =
  (guess: Guess) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    // no practice running
    const practice = state.currentPractice
    if (!practice) return state

    // practice already finished
    const currentGuessable = practice.guessables[practice.index]
    if (!currentGuessable) return state

    const updatedBanks = updateActiveBank((b) => ({
      ...b,
      learnables: b.learnables.map((l) => {
        if (l.id !== currentGuessable.id || guess === 'unanswered') return l
        return addGuessToLearnable(
          l,
          guess === 'right',
          practice.reverseDirection
        )
      })
    }))(state)

    return {
      ...updatedBanks,
      currentPractice: {
        ...practice,
        index: practice.index + 1,
        guessables: updateGuessables(
          practice.guessables,
          currentGuessable.id,
          guess
        )
      }
    }
  }

export const quitPracticeEarly =
  () =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const currentPractice = state.currentPractice
    if (!currentPractice) return state

    return {
      ...state,
      currentPractice: {
        ...currentPractice,
        index: currentPractice.guessables.length
      }
    }
  }

export const removePractice =
  () =>
  (state: LearnablesStoreType): LearnablesStoreType => ({
    ...state,
    currentPractice: null
  })
