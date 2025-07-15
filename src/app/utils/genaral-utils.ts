import {
  AutoParseableTextFormat,
  makeParseableTextFormat
} from 'openai/lib/parser.mjs'
import { ResponseFormatTextJSONSchemaConfig } from 'openai/resources/responses/responses.mjs'
import z from 'zod'

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
