import {
  AutoParseableTextFormat,
  makeParseableTextFormat
} from 'openai/lib/parser.mjs'
import { ResponseFormatTextJSONSchemaConfig } from 'openai/resources/responses/responses.mjs'
import z from 'zod'
import {
  CollectionBase,
  Learnable,
  LearnableWithId
} from '../types_and_schemas/types'

/**
 *
 * necessary to use zod with openai responses. zod 4 introduces a bug with. the openai helper package which is not fixed yet.
 * https://github.com/openai/openai-node/issues/1576#issuecomment-3056734414
 */
export function zodTextFormat<ZodInput extends z.ZodType>(
  zodObject: ZodInput,
  name: string,
  props?: Omit<
    ResponseFormatTextJSONSchemaConfig,
    'schema' | 'type' | 'strict' | 'name'
  >
): AutoParseableTextFormat<z.infer<ZodInput>> {
  return makeParseableTextFormat(
    {
      type: 'json_schema',
      ...props,
      name,
      strict: true,
      schema: z.toJSONSchema(zodObject, { target: 'draft-7' })
    },
    (content) => zodObject.parse(JSON.parse(content))
  )
}

export const calculateAverageConfidencePercent = (
  learnables: Learnable[]
): number => {
  const allGuesses = learnables.flatMap((l) => [
    ...l.guesses.lexeme,
    ...l.guesses.translation
  ])

  if (allGuesses.length === 0) return 0

  const trueGuesses = allGuesses.filter(Boolean).length
  const confidencePercent = trueGuesses / allGuesses.length

  return Math.round(confidencePercent * 100)
}

export const getCollectionlessLearnableIds = (
  learnables: LearnableWithId[],
  collections: CollectionBase[]
): string[] => {
  const collectionLearnableIds = collections.flatMap((c) => c.learnableIDs)
  return learnables
    .map((l) => l.id)
    .filter((id) => !collectionLearnableIds.includes(id))
}

export const getCollectionlessLearnables = (
  learnables: Learnable[],
  collections: CollectionBase[]
): Learnable[] => {
  const collectionLearnableIds = collections.flatMap((c) => c.learnableIDs)
  return learnables.filter((l) => !collectionLearnableIds.includes(l.id))
}

export const removeDuplicates = (array: string[]): string[] => {
  return Array.from(new Set(array))
}
