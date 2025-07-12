import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { inject } from '@angular/core'
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { AiService } from '../services/ai.service'
import {
  LearnableBase,
  LearnableCreationConfig,
  LearnableUpdated
} from '../types_and_schemas/types'
import { initialLearnables } from './initialStates'
import {
  removeLearnables,
  saveNewLearnables,
  setGuess,
  startPractice,
  updateLearnables
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
      async generate(config: LearnableCreationConfig) {},
      addLearnables(learnables: LearnableBase[]) {
        patchState(state, saveNewLearnables(learnables))
      },
      updateLearnables(learnables: LearnableUpdated[]) {
        patchState(state, updateLearnables(learnables))
      },
      removeLearnables(ids: string[]) {
        patchState(state, removeLearnables(ids))
      },
      startPractice(ids: string[], reverseDirection: boolean) {
        patchState(state, startPractice(ids, reverseDirection))
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
