import { ExportCollectionArraySchema } from '../types_and_schemas/schemas'
import {
  ExportedCollection,
  Learnable,
  LearnableCollection
} from '../types_and_schemas/types'

export const mapToExpCollection = (
  allLearnables: Learnable[],
  collection: LearnableCollection
): ExportedCollection => {
  const relevantLearnables = allLearnables.filter((l) =>
    collection.learnableIDs.includes(l.id)
  )
  const baseLearnables = relevantLearnables.map((learnable) => ({
    lexeme: learnable.lexeme,
    translation: learnable.translation,
    type: learnable.type,
    notes: learnable.notes
  }))

  return {
    learnables: baseLearnables,
    name: collection.name
  }
}

export const mapFromExpCollection = (
  fileAsString: string
): ExportedCollection[] => {
  try {
    return ExportCollectionArraySchema.parse(JSON.parse(fileAsString))
  } catch (e) {
    console.error('Failed to parse learnables from file:', e)
    throw new Error('Invalid file format')
  }
}

export const verifiyImportedFileValidity = (file: File): void => {
  const contentIsCorrectFormat = file.type === 'application/json'
  const fileSuffixIsCorrect =
    file.name.split('.').pop()?.toLowerCase() === 'vocab'

  if (!contentIsCorrectFormat) {
    throw new Error('Faulty file content.')
  }
  if (!fileSuffixIsCorrect) {
    throw new Error('Wrong file extension.')
  }
}
