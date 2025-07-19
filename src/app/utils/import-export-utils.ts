import { LearnableFileSchema } from '../types_and_schemas/schemas'
import { LearnableBase, LearnableFile } from '../types_and_schemas/types'

export const mapLearnablesToFileSchema = (
  learnables: LearnableBase[],
  collectionName: string
): LearnableFile => {
  const baseLearnables = learnables.map((learnable) => ({
    lexeme: learnable.lexeme,
    translation: learnable.translation,
    type: learnable.type,
    notes: learnable.notes || ''
  }))

  return {
    learnables: baseLearnables,
    collectionName
  }
}

export const mapFileSchemaToLearnables = (file: string): LearnableBase[] => {
  const file = LearnableFileSchema.parse(file)
}
