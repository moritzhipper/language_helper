import { config } from '../../config'
import { BankBaseSchema } from '../types_and_schemas/schemas'
import {
  BankBase,
  BankExportOffline,
  BankUser,
  Collection,
  LearnableBase,
  LearnableWithId,
  UserLearnable
} from '../types_and_schemas/types'

// #region Export Functions

/**
 * Maps the learnables and collections to a format suitable to put into a file for export.
 */
export const mapToBankExport = (
  name: string,
  bank: BankUser,
  onlyCollectionIDs?: string[]
): BankExportOffline => {
  // Get collections to export
  const collectionsToExport = bank.collections.filter((c) =>
    onlyCollectionIDs ? onlyCollectionIDs.includes(c.id) : true
  )

  // Get all card IDs that belong to the collections being exported
  const cardIdsInExportedCollections = new Set(
    collectionsToExport.flatMap((c) => c.cardIds)
  )

  // Filter learnables: if exporting specific collections, only include cards in those collections
  const learnables: LearnableWithId[] = bank.learnables
    .filter((l) =>
      onlyCollectionIDs ? cardIdsInExportedCollections.has(l.id) : true
    )
    .map((l) => ({
      lexeme: l.lexeme,
      translation: l.translation,
      type: l.type,
      id: l.id,
      notes: l.notes
    }))

  // Map collections with only the cardIds that are being exported
  const exportedLearnableIds = new Set(learnables.map((l) => l.id))
  const collections: Collection[] = collectionsToExport.map((c) => ({
    name: c.name,
    id: c.id,
    cardIds: c.cardIds.filter((cardId) => exportedLearnableIds.has(cardId))
  }))

  return {
    name,
    created: new Date(),
    bank: {
      language: bank.language,
      learnables,
      collections
    }
  }
}

// #region Import Functions

export const parseFileImportString = (fileAsString: string): BankBase => {
  try {
    return BankBaseSchema.parse(JSON.parse(fileAsString))
  } catch (e) {
    console.error('Failed to parse learnables from file:', e)
    throw new Error('Invalid file format')
  }
}

export const verifiyImportedFileValidity = (file: File): void => {
  const fileSuffixIsCorrect =
    file.name.split('.').pop()?.toLowerCase() === config.fileExportSuffix

  if (!fileSuffixIsCorrect) {
    throw new Error('Wrong file extension.')
  }
}

export const filterDoubleEntries = (
  newLearnables: LearnableBase[],
  existingLearnables: UserLearnable[]
): LearnableBase[] => {
  const setOfLexemes = new Set<string>()

  // remove double entries from ai generated learnables
  const uniqueNewLearnables = newLearnables.filter((l) => {
    const isUnique = !setOfLexemes.has(l.lexeme)
    setOfLexemes.add(l.lexeme)
    return isUnique
  })

  // filter out learnables that already exist in the store
  const filteredNewLearnables = newLearnables.filter(
    (newL) =>
      !existingLearnables.some(
        (existingL) =>
          existingL.lexeme === newL.lexeme &&
          existingL.translation === newL.translation
      )
  )

  return filteredNewLearnables
}
