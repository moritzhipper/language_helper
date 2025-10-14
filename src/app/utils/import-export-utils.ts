import { config } from '../../config'
import { BankExportSchema } from '../types_and_schemas/schemas'
import {
  BankExport,
  CollectionBase,
  Learnable,
  LearnableBase,
  LearnableCollectionWithId,
  LearnableUserCollection,
  LearnableWithId
} from '../types_and_schemas/types'

// #region Export Functions

/**
 * Maps the learnables and collections to a format suitable to put into a file for export.
 */
export const mapToBankExport = (
  name: string,
  learnables: Learnable[],
  collections: LearnableCollectionWithId[],
  removeCardsWithoutCollection: boolean = false
): BankExport => {
  let relevantLearnables = learnables

  if (removeCardsWithoutCollection) {
    const idsOfCollections = collections.flatMap((c) => c.learnableIDs)
    relevantLearnables = relevantLearnables.filter((l) =>
      idsOfCollections.includes(l.id)
    )
  }

  const learnableExp: LearnableWithId[] = relevantLearnables.map(
    (learnable) => ({
      lexeme: learnable.lexeme,
      translation: learnable.translation,
      type: learnable.type,
      notes: learnable.notes,
      id: learnable.id
    })
  )

  const collectionExp: CollectionBase[] = collections.map((c) => ({
    name: c.name,
    learnableIDs: c.learnableIDs
  }))

  return {
    name,
    learnables: learnableExp,
    collections: collectionExp
  }
}

// #region Import Functions

export const parseFileImportString = (fileAsString: string): BankExport => {
  try {
    return BankExportSchema.parse(JSON.parse(fileAsString))
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

/**
 * Maps the file import to a format suitable for adding to the store.
 * Replaces new IDS with IDs from existing learnables if newly imported card is a duplicate.
 * Reassigns new IDs to non duplicates ensure uniqueness and avoid conflicts with existing learnables when reimporting collections.
 */
export const mapFileImportToAddableLearnables = (
  fileImport: BankExport,
  existingLearnables: Learnable[]
): { learnables: Learnable[]; collections: LearnableUserCollection[] } => {
  const now = new Date()

  // create a map to ensure unique IDs in the import
  // this is necessary to avoid conflicts with existing learnables on reimport
  const newIdMap = new Map<string, string>()
  const existingIdMap = new Map<string, string>()

  fileImport.learnables.filter((newL) => {
    const existingCard = existingLearnables.find(
      (exEl) =>
        exEl.lexeme === newL.lexeme &&
        exEl.translation === newL.translation &&
        exEl.type === newL.type
    )

    if (existingCard) {
      existingIdMap.set(newL.id, existingCard.id)
    } else {
      newIdMap.set(newL.id, crypto.randomUUID())
    }
  })

  // dont use spread here to avoid bleeding old or unused attributes into the store
  const learnables = fileImport.learnables
    .filter((l) => newIdMap.has(l.id))
    .map((l) => ({
      id: newIdMap.get(l.id)!,
      created: now,
      type: l.type,
      lexeme: l.lexeme,
      translation: l.translation,
      notes: l.notes,
      guesses: {
        lexeme: [false, false, false, false, false],
        translation: [false, false, false, false, false]
      }
    }))

  const collections = fileImport.collections.map((c) => ({
    id: crypto.randomUUID(),
    created: now,
    name: c.name,
    learnableIDs: c.learnableIDs.map(
      (id) => existingIdMap.get(id) ?? newIdMap.get(id) ?? id
    ),
    practicedDates: []
  }))

  return {
    learnables,
    collections
  }
}

export const filterDoubleEntries = (
  newLearnables: LearnableBase[],
  existingLearnables: Learnable[]
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
