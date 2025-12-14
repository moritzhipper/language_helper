import {
  LearnableBase,
  LearnablesStoreType,
  UserLearnablePartial
} from '../../types_and_schemas/types'
import { mapBaseToFullToLearnables, updateActiveBank } from './mutator-utils'

export const saveNewlyCreatedLearnables =
  (learnablesBase: LearnableBase[]) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => {
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
    })

export const updateLearnables =
  (updatedL: UserLearnablePartial[]) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => ({
      ...b,
      learnables: b.learnables.map((l) => {
        const updated = updatedL.find((ul) => ul.id === l.id)
        if (!updated) return l
        return { ...l, ...updated }
      })
    }))
