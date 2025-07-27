import { computed, inject, Injectable } from '@angular/core'
import OpenAI from 'openai'
// reimport when zod v4 + openai compatibility bug is fixed
// until then use helper function zodTextFormat from utils/genaral-utils
// import { zodTextFormat } from 'openai/helpers/zod'
import { ChatModel } from 'openai/resources/shared.mjs'
import { SettingsStore } from '../store/settingsStore'
import { LearnableResponseSchema } from '../types_and_schemas/schemas'
import {
  LearnableBase,
  LearnableBaseFromAi,
  LearnableCreationConfig
} from '../types_and_schemas/types'
import { zodTextFormat } from '../utils/genaral-utils'

import {
  mapAndFilterWordsFromInput,
  mapPhrasesFromInputToChunks,
  splitArrayIntoBatches
} from './ai/ai-utils'
import { getPhrasesPrompt, getWordsPrompt } from './ai/prompt'

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly model: ChatModel = 'chatgpt-4o-latest'
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
    const cardPromises: Promise<LearnableBaseFromAi[]>[] = []

    // when both, do call phrase and cards, if one of them, call one of them
    // chatgpt skips a lot of input when doing both at once
    if (config.type === 'phrases' || config.type === 'both') {
      cardPromises.push(this._createPhrases(config.input))
    }
    if (config.type === 'words' || config.type === 'both') {
      cardPromises.push(this._createWords(config.input, config.excludeWords))
    }

    const cardLists = await Promise.all(cardPromises)
    const cards = cardLists.flat(1)

    return cards.map((l) => ({ ...l, notes: '' }))
  }

  private async _createPhrases(
    userInput: string
  ): Promise<LearnableBaseFromAi[]> {
    const prompt = getPhrasesPrompt(
      this.settingsStore.learningLang(),
      this.settingsStore.speakingLang()
    )

    // this is a workaround for gpt-4o missing a lot of phrases when given to long input
    // increasing batchsize may improve speed, but reduce accuracy
    // reducing it increases accuracy, but reduces speed and increases token usage
    const maxChunkSize = 500
    const chunks = mapPhrasesFromInputToChunks(userInput, maxChunkSize)
    const chunkPromises = chunks.map((chunk) =>
      this._createCards(chunk, prompt)
    )

    const cardsLists = await Promise.all(chunkPromises)

    return cardsLists.flat(1)
  }

  private async _createWords(
    userInput: string,
    excludeWords: string[]
  ): Promise<LearnableBaseFromAi[]> {
    // preemptively filter words from input that are in excluded words
    // to not make ai create double entries and thus reduce token usage
    const newUniqueWords = mapAndFilterWordsFromInput(userInput, excludeWords)
    const prompt = getWordsPrompt(
      this.settingsStore.learningLang(),
      this.settingsStore.speakingLang()
    )

    // this is a workaround for gpt-4o missing a lot of words when given a longer input
    // splitting the input into batches of smaller words improves input adherence
    // increasing batchsize may improve speed, but reduce accuracy
    // reducing it increases accuracy, but reduces speed and increases token usage
    const batchSize = 20
    const batches = splitArrayIntoBatches(newUniqueWords, batchSize)
    const cardPromises = batches.map((batch) =>
      this._createCards(batch.join(','), prompt)
    )

    const cardsLists = await Promise.all(cardPromises)
    const cards = cardsLists.flat(1)

    // when the input language is not the speaking language, the can not be filtered preemptively
    // as a result it is necessary to filter the cards again after creation
    const filteredCards = cards.filter(
      (c) => !newUniqueWords.includes(c.lexeme)
    )

    return filteredCards
  }

  private async _createCards(
    userInput: string,
    prompt: string
  ): Promise<LearnableBaseFromAi[]> {
    const response = await this.oAi().responses.parse({
      model: this.model,
      text: {
        format: zodTextFormat(LearnableResponseSchema, 'learnable_base')
      },
      input: [
        { role: 'system', content: prompt },
        { role: 'user', content: userInput }
      ]
    })

    this.settingsStore.addTokensUsed(response.usage?.total_tokens ?? 0)
    return response.output_parsed?.learnables || []
  }
}
