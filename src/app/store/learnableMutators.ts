import {
  Learnable,
  LearnableBase,
  LearnablesStoreType
} from '../types_and_schemas/types'

export const startPractice =
  (ids: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,
      currentPractice: {
        ids,
        index: 0,
        guesses: []
      }
    }
  }

export const saveBaseLearnables =
  (learnablesBase: LearnableBase[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const learnables = mapToLearnables(learnablesBase)
    const filteredLearnables = filterDoubleEntries(learnables)

    return {
      ...state,
      isConverting: false,
      learnables: [...filteredLearnables, ...state.learnables]
    }
  }

export const setGuess =
  (isCorrect: boolean) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const currentP = state.currentPractice

    // noop when finished or no practice
    if (!currentP || currentP.index >= currentP.ids.length) return state

    const currentLearnable = state.learnables.find(
      (l) => l.id === currentP.ids[currentP.index]
    )!

    // slice to only save last five guesses
    const updatedLearnable: Learnable = {
      ...currentLearnable,
      lastGuesses: [...currentLearnable.lastGuesses.slice(1), isCorrect]
    }

    return {
      ...state,
      learnables: updateLearnableInList(updatedLearnable, state.learnables),
      currentPractice: {
        ...currentP,
        index: currentP.index + 1,
        guesses: [
          ...currentP.guesses,
          {
            id: currentP.ids[currentP.index],
            isCorrect
          }
        ]
      }
    }
  }

const updateLearnableInList = (
  updatedLearnable: Learnable,
  learnables: Learnable[]
): Learnable[] => {
  return learnables.map((l) => {
    if (l.id !== updatedLearnable.id) return l
    return {
      ...l,
      ...updatedLearnable
    }
  })
}

const mapToLearnables = (learnableBase: LearnableBase[]): Learnable[] => {
  return learnableBase.map((l) => ({
    ...l,
    id: crypto.randomUUID(),
    linkedIds: [],
    lastGuesses: [false, false, false, false, false],
    notes: '',
    created: new Date()
  }))
}

const filterDoubleEntries = (learnables: Learnable[]): Learnable[] => {
  const uniqueLexemes = new Set<string>()
  return learnables.filter((l) => {
    if (uniqueLexemes.has(l.lexeme)) {
      return false
    }
    uniqueLexemes.add(l.lexeme)
    return true
  })
}
