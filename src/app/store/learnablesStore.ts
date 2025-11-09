import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { computed } from '@angular/core'
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState
} from '@ngrx/signals'
import {
  BankBase,
  LanguageConfig,
  LearnableBase,
  UserLearnablePartial
} from '../types_and_schemas/types'
import { initialState } from './initialStates'
import {
  createCollection,
  deleteCollection,
  editCollection,
  quitPracticeEarly,
  removeLearnables,
  removePractice,
  renameCollection,
  saveImportedCollections,
  saveNewlyCreatedLearnables,
  setGuess,
  startPractice,
  updateBankLanguage,
  updateLearnables
} from './learnableMutators'

export const LearnablesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withStorageSync({
    key: 'language_helper_learnables',
    storage: () => localStorage
  }),
  withComputed((state) => ({
    activeBank: computed(() => {
      return state.banks().find((b) => b.id === state.activeBankId())!
    }),
    collections: computed(() => {
      return (
        state.banks().find((b) => b.id === state.activeBankId())?.collections ||
        []
      )
    }),
    learnables: computed(() => {
      return (
        state.banks().find((b) => b.id === state.activeBankId())?.learnables ||
        []
      )
    })
  })),
  withMethods((state) => {
    return {
      addLearnables(learnablesBase: LearnableBase[]) {
        patchState(state, saveNewlyCreatedLearnables(learnablesBase))
      },
      updateLearnables(learnables: UserLearnablePartial[]) {
        patchState(state, updateLearnables(learnables))
      },
      removeLearnables(ids: string[]) {
        patchState(state, removeLearnables(ids))
      },
      startPractice(ids: string[], reverseDirection: boolean) {
        patchState(state, startPractice(ids, reverseDirection))
      },
      createCollection(name: string, ids: string[]) {
        patchState(state, createCollection(name, ids))
      },
      editCollectionLearnables(
        collectionID: string,
        addIDs: string[],
        deleteIDs: string[]
      ) {
        patchState(state, editCollection(collectionID, addIDs, deleteIDs))
      },
      importBankExport(importStore: BankBase) {
        patchState(state, saveImportedCollections(importStore))
      },
      editCollection(name: string, id: string) {
        patchState(state, renameCollection(name, id))
      },
      deleteCollection(id: string, removeLearnables: boolean = false) {
        patchState(state, deleteCollection(id))
      },
      editBankLanguage(language: LanguageConfig) {
        patchState(state, updateBankLanguage(language))
      },
      quitPracticePrematurly() {
        patchState(state, quitPracticeEarly())
      },
      quitPractice() {
        patchState(state, removePractice())
      },
      setGuess(isCorrect: boolean) {
        patchState(state, setGuess(isCorrect))
      },
      reset() {
        patchState(state, initialState)
      }
    }
  })
)
