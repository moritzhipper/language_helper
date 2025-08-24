import { config } from '../../config'
import { StoreExportSchema } from '../types_and_schemas/schemas'
import {
  CollectionExport,
  Learnable,
  LearnableBase,
  LearnableCollection,
  LearnableExport,
  StoreExport
} from '../types_and_schemas/types'

// #region Export Functions

/**
 * Maps the learnables and collections to a format suitable to put into a file for export.
 */
export const mapToExport = (
  learnables: Learnable[],
  collections: LearnableCollection[],
  removeCardsWithoutCollection: boolean = false
): StoreExport => {
  let relevantLearnables = learnables

  if (removeCardsWithoutCollection) {
    const idsOfCollections = collections.flatMap((c) => c.learnableIDs)
    relevantLearnables = relevantLearnables.filter((l) =>
      idsOfCollections.includes(l.id)
    )
  }

  const learnableExp: LearnableExport[] = relevantLearnables.map(
    (learnable) => ({
      lexeme: learnable.lexeme,
      translation: learnable.translation,
      type: learnable.type,
      notes: learnable.notes,
      id: learnable.id
    })
  )

  const collectionExp: CollectionExport[] = collections.map((c) => ({
    name: c.name,
    learnableIDs: c.learnableIDs
  }))

  return {
    learnables: learnableExp,
    collections: collectionExp
  }
}

// #region Import Functions

export const parseFileImportString = (fileAsString: string): StoreExport => {
  try {
    return StoreExportSchema.parse(JSON.parse(fileAsString))
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
 * Reassigns new IDs to ensure uniqueness and avoid conflicts with existing learnables when reimporting collections.
 */
export const mapFileImportToAddableLearnables = (
  fileImport: StoreExport
): { learnables: Learnable[]; collections: LearnableCollection[] } => {
  // create a map to ensure unique IDs in the import
  // this is necessary to avoid conflicts with existing learnables on reimport
  const idMap = new Map<string, string>()
  fileImport.learnables.forEach((l) => idMap.set(l.id, crypto.randomUUID()))

  const now = new Date()

  // dont use spread here to avoid bleeding old or unused attributes into the store
  const learnables = fileImport.learnables.map((l) => ({
    id: idMap.get(l.id)!,
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
    learnableIDs: c.learnableIDs.map((id) => idMap.get(id)!),
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
