import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { inject } from '@angular/core'
import { signalStore, withMethods } from '@ngrx/signals'
import { Learnable } from '../../types_and_schemas/types'
import { AiService } from '../services/ai.service'

export const BuddyStore = signalStore(
  { providedIn: 'root' },
  withStorageSync({ key: 'language_helper', storage: () => localStorage }),
  withMethods(() => {
    const aiS = inject(AiService)
    return {
      addLearnables(string: string) {},
      updateLearnable(learnable: Learnable) {},
      removeLearnables(ids: string[]) {},
    }
  })
)
