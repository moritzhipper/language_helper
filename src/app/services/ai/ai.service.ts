import { computed, inject, Injectable } from '@angular/core'
import OpenAI from 'openai'
// reimport when zod v4 + openai compatibility bug is fixed
// until then use helper function zodTextFormat from utils/genaral-utils
// import { zodTextFormat } from 'openai/helpers/zod'
import { ChatModel } from 'openai/resources/shared.mjs'
import { SettingsStore } from '../../store/settingsStore'
import { LearnablesFromAiSchema } from '../../types_and_schemas/schemas'
import {
  LearnableBase,
  LearnableCreationConfig,
  LearnableFromAI
} from '../../types_and_schemas/types'
import { zodTextFormat } from '../../utils/genaral-utils'
import { mapPhrasesFromInputToChunks } from './ai-utils'
import { getPhrasesPrompt, getWordsPrompt } from './prompt'

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly model: ChatModel = 'gpt-5.1'
  private readonly settingsStore = inject(SettingsStore)

  private oAi = computed(
    () =>
      new OpenAI({
        apiKey: this.settingsStore.apiKey(),
        dangerouslyAllowBrowser: true
      })
  )

  async createLearnablesFromString(
    config: LearnableCreationConfig
  ): Promise<LearnableBase[]> {
    const cardPromises: Promise<LearnableBase[]>[] = []

    // when both, do call phrase and cards, if one of them, call one of them
    // chatgpt skips a lot of input when doing both at once
    if (config.type === 'phrases' || config.type === 'both') {
      cardPromises.push(this._createPhrases(config))
    }
    if (config.type === 'words' || config.type === 'both') {
      cardPromises.push(this._createWords(config))
    }

    const cardLists = await Promise.all(cardPromises)
    const cards = cardLists.flat(1)

    return cards
  }

  private async _createPhrases(
    config: LearnableCreationConfig
  ): Promise<LearnableBase[]> {
    // this is a workaround for gpt-4o missing a lot of phrases when given to long input
    // increasing batchsize may improve speed, but reduce accuracy
    // reducing it increases accuracy, but reduces speed and increases token usage
    const maxChunkSize = 1000
    const chunks = mapPhrasesFromInputToChunks(config.input, maxChunkSize)
    const prompt = getPhrasesPrompt(config.language)
    const chunkPromises = chunks.map((chunk) =>
      this._extractCards(chunk, prompt)
    )

    const cardsLists = await Promise.all(chunkPromises)

    return cardsLists.flat(1).map((c) => ({
      ...c,
      notes: '',
      type: 'phrase'
    }))
  }

  private async _createWords(
    config: LearnableCreationConfig
  ): Promise<LearnableBase[]> {
    // this is a workaround for gpt-4o missing a lot of words when given a longer input
    // splitting the input into batches of smaller words improves input adherence
    // increasing batchsize may improve speed, but reduce accuracy
    // reducing it increases accuracy, but reduces speed and increases token usage
    const chunkSize = 300
    const batches = mapPhrasesFromInputToChunks(config.input, chunkSize)
    const prompt = getWordsPrompt(config.language)
    const cardPromises = batches.map((chunk) =>
      this._extractCards(chunk, prompt)
    )

    const cardsLists = await Promise.all(cardPromises)

    return cardsLists.flat(1).map((c) => ({
      ...c,
      notes: '',
      type: 'word'
    }))
  }

  private async _extractCards(
    input: string,
    prompt: string
  ): Promise<LearnableFromAI[]> {
    const response = await this.oAi().responses.parse({
      model: this.model,
      text: {
        format: zodTextFormat(LearnablesFromAiSchema, 'learnable_cards')
      },
      input: [
        { role: 'system', content: prompt },
        {
          role: 'user',
          content: input
        }
      ]
    })

    this.settingsStore.addTokensUsed(response.usage?.total_tokens ?? 0)
    const cards = response.output_parsed?.cards || []
    return cards.map((c) => ({
      lexeme: c.lexeme,
      translation: c.translation
    }))
  }
}
