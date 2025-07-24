import { config } from '../../config'
import { StoreExportSchema } from '../types_and_schemas/schemas'
import {
  CollectionExport,
  Learnable,
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
  collections: LearnableCollection[]
): StoreExport => {
  const relevantLearnables: Learnable[] = []
  const collectionWasSpecified = collections.length > 0

  // when no collection was specified, export all learnables
  // otherwise, only export learnables that are in the specified collections
  if (!collectionWasSpecified) {
    relevantLearnables.push(...learnables)
  } else {
    const relevantIds = collections.flatMap((c) => c.learnableIDs)
    const filteredLearnables = learnables.filter((l) =>
      relevantIds.includes(l.id)
    )
    relevantLearnables.push(...filteredLearnables)
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
