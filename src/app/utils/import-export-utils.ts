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

  // create a map to ensure unique IDs in the export
  // this is necessary to avoid conflicts when reimporting
  const idMap = new Map<string, string>()
  relevantLearnables.forEach((l) => idMap.set(l.id, crypto.randomUUID()))

  const learnableExp: LearnableExport[] = relevantLearnables.map(
    (learnable) => ({
      lexeme: learnable.lexeme,
      translation: learnable.translation,
      type: learnable.type,
      notes: learnable.notes,
      id: idMap.get(learnable.id)!
    })
  )
  const collectionExp: CollectionExport[] = collections.map((c) => ({
    name: c.name,
    learnableIDs: c.learnableIDs.map((id) => idMap.get(id)!)
  }))

  return {
    learnables: learnableExp,
    collections: collectionExp
  }
}

export const parseFileImportString = (fileAsString: string): StoreExport => {
  try {
    return StoreExportSchema.parse(JSON.parse(fileAsString))
  } catch (e) {
    console.error('Failed to parse learnables from file:', e)
    throw new Error('Invalid file format')
  }
}

export const verifiyImportedFileValidity = (file: File): void => {
  debugger
  const contentIsCorrectFormat = file.type === 'application/json'
  const fileSuffixIsCorrect =
    file.name.split('.').pop()?.toLowerCase() === config.fileExportSuffix

  if (!contentIsCorrectFormat) {
    throw new Error('Faulty file content.')
  }
  if (!fileSuffixIsCorrect) {
    throw new Error('Wrong file extension.')
  }
}

// #region Import Functions

export const mapFileImportToAddableLearnables = (
  fileImport: StoreExport
): { learnables: Learnable[]; collections: LearnableCollection[] } => {
  const learnables = mapLearnableImportToFullLearnables(fileImport.learnables)
  const collections = mapCollectionExportToFullCollection(
    fileImport.collections
  )

  return {
    learnables,
    collections
  }
}

export const mapLearnableImportToFullLearnables = (
  learnable: LearnableExport[]
): Learnable[] => {
  const now = new Date()
  return learnable.map((l) => ({
    id: l.id,
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
}

export const mapCollectionExportToFullCollection = (
  collections: CollectionExport[]
): LearnableCollection[] => {
  const now = new Date()

  return collections.map((c) => ({
    id: crypto.randomUUID(),
    created: now,
    name: c.name,
    learnableIDs: c.learnableIDs,
    practicedDates: []
  }))
}
