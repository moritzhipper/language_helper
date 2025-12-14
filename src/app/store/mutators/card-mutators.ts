import {
  LearnableBase,
  LearnablesStoreType,
  UserLearnablePartial
} from '../../types_and_schemas/types'
import { updateActiveBank } from './mutator-utils'
import {
  mapBaseToFullToLearnables,
  removeLearnablesFromBank
} from './shared-mutators'

export const saveNewlyCreatedLearnables =
  (learnablesBase: LearnableBase[]) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank((b) => {
      // Filter out duplicates in input and items that already exist in bank
      const newLearnables = learnablesBase.filter(
        (lb, index, self) =>
          self.findIndex(
            (other) =>
              other.lexeme === lb.lexeme && other.translation === lb.translation
          ) === index &&
          !b.learnables.some(
            (l) => lb.lexeme === l.lexeme && lb.translation === l.translation
          )
      )

      const fullNew = mapBaseToFullToLearnables(newLearnables)

      return {
        ...b,
        learnables: [...b.learnables, ...fullNew]
      }
    })(state)

export const removeLearnables =
  (ids: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    removeLearnablesFromBank(state, ids)

export const updateLearnables =
  (updatedL: UserLearnablePartial[]) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank((b) => ({
      ...b,
      learnables: b.learnables.map((l) => {
        const updated = updatedL.find((ul) => ul.id === l.id)
        if (!updated) return l
        return { ...l, ...updated }
      })
    }))(state)
