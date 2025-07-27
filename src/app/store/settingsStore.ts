import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { SettingsStoreType } from '../types_and_schemas/types'
import { initialSettings } from './initialStates'

export const SettingsStore = signalStore(
  { providedIn: 'root' },
  withState(initialSettings),
  withStorageSync({
    key: 'language_helper_settings',
    storage: () => localStorage
  }),
  withMethods((store) => ({
    updateSettings(settings: Partial<SettingsStoreType>) {
      patchState(store, settings)
    },
    addTokensUsed(tokens: number) {
      patchState(store, {
        tokensUsed: store.tokensUsed() + tokens
      })
    }
  }))
)
