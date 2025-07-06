import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { inject } from '@angular/core'
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { AiService } from '../services/ai.service'
import { Learnable, LearnableBase } from '../types_and_schemas/types'
import { initialLearnables } from './initialStates'
import { setGuess, startPractice } from './learnableMutators'

export const LearnablesStore = signalStore(
  { providedIn: 'root' },
  withState(initialLearnables),
  withStorageSync({
    key: 'language_helper_learnables',
    storage: () => localStorage
  }),
  withMethods((state) => {
    const aiS = inject(AiService)

    return {
      async addLearnables(text: string) {
        console.info('Starting conversion')
        const excludedWords = state.learnables().map((l) => l.lexeme)
        const baseLearnables = await aiS.createLearnablesFromString(
          text,
          excludedWords
        )
        console.info('Conversion finished', baseLearnables)
        const learnables = mapToLearnables(baseLearnables)
        const filteredLearnables = filterDoubleEntries(learnables)

        patchState(state, {
          learnables: [...filteredLearnables, ...state.learnables()]
        })
      },
      updateLearnable(id: string, learnable: Partial<Learnable>) {},
      removeLearnables(ids: string[]) {},
      startPractice(ids: string[]) {
        patchState(state, startPractice(ids))
      },
      endPractice() {
        patchState(state, { currentPractice: null })
      },
      setGuess(isCorrect: boolean) {
        patchState(state, setGuess(isCorrect))
      }
    }
  })
)

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
