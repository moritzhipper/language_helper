import { config } from '../../config'
import { StoreExportSchema } from '../types_and_schemas/schemas'
import {
  CollectionExport,
  Learnable,
  LearnableCollection,
  LearnableExport,
  StoreExport
} from '../types_and_schemas/types'

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

export const mapFromExpCollection = (fileAsString: string): StoreExport => {
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
