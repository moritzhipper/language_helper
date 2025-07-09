import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { inject } from '@angular/core'
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { AiService } from '../services/ai.service'
import { Learnable, LearnableCreationConfig } from '../types_and_schemas/types'
import { initialLearnables } from './initialStates'
import {
  saveBaseLearnables,
  setGuess,
  startPractice
} from './learnableMutators'

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
      async addLearnables(config: LearnableCreationConfig) {
        patchState(state, { isConverting: true })
        const excludedWords = state.learnables().map((l) => l.lexeme)
        const baseLearnables = await aiS.createLearnablesFromString(
          config,
          excludedWords
        )

        patchState(state, saveBaseLearnables(baseLearnables))
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
      },
      reset() {
        patchState(state, initialLearnables)
      }
    }
  })
)
