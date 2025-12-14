import {
  Guess,
  Guessable,
  LearnablesStoreType,
  UserLearnable
} from '../../types_and_schemas/types'
import { updateActiveBank } from './mutator-utils'

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

    const updatedBanks = updateActiveBank(state, (b) => ({
      ...b,
      learnables: b.learnables.map((l) => {
        if (l.id !== currentGuessable.id || guess === 'unanswered') return l
        return addGuessToLearnable(
          l,
          guess === 'right',
          practice.reverseDirection
        )
      })
    }))

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
