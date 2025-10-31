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
  LearnableCreationConfig
} from '../../types_and_schemas/types'
import { zodTextFormat } from '../../utils/genaral-utils'
import { mapPhrasesFromInputToChunks } from './ai-utils'
import { getPhrasesPrompt, getWordsPrompt } from './prompt'

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

  private _wordsPrompt = computed(() =>
    getWordsPrompt(
      this.settingsStore.learningLang(),
      this.settingsStore.speakingLang()
    )
  )
  private _phrasesPrompt = computed(() =>
    getPhrasesPrompt(
      this.settingsStore.learningLang(),
      this.settingsStore.speakingLang()
    )
  )

  async createLearnablesFromString(
    config: LearnableCreationConfig
  ): Promise<LearnableBase[]> {
    const cardPromises: Promise<LearnableBase[]>[] = []

    // when both, do call phrase and cards, if one of them, call one of them
    // chatgpt skips a lot of input when doing both at once
    if (config.type === 'phrases' || config.type === 'both') {
      cardPromises.push(this._createPhrases(config.input))
    }
    if (config.type === 'words' || config.type === 'both') {
      cardPromises.push(this._createWords(config.input))
    }

    const cardLists = await Promise.all(cardPromises)
    const cards = cardLists.flat(1)

    return cards
  }

  private async _createPhrases(userInput: string): Promise<LearnableBase[]> {
    // this is a workaround for gpt-4o missing a lot of phrases when given to long input
    // increasing batchsize may improve speed, but reduce accuracy
    // reducing it increases accuracy, but reduces speed and increases token usage
    const maxChunkSize = 1000
    const chunks = mapPhrasesFromInputToChunks(userInput, maxChunkSize)
    const chunkPromises = chunks.map((chunk) =>
      this._extractCards(chunk, 'phrases')
    )

    const cardsLists = await Promise.all(chunkPromises)

    return cardsLists.flat(1)
  }

  private async _createWords(userInput: string): Promise<LearnableBase[]> {
    // this is a workaround for gpt-4o missing a lot of words when given a longer input
    // splitting the input into batches of smaller words improves input adherence
    // increasing batchsize may improve speed, but reduce accuracy
    // reducing it increases accuracy, but reduces speed and increases token usage
    const chunkSize = 300
    const batches = mapPhrasesFromInputToChunks(userInput, chunkSize)
    const cardPromises = batches.map((batch) =>
      this._extractCards(batch, 'words')
    )

    const cardsLists = await Promise.all(cardPromises)
    return cardsLists.flat(1)
  }

  private async _extractCards(
    userInput: string,
    type: LearnableCreationConfig['type']
  ): Promise<LearnableBase[]> {
    const prompt =
      type === 'phrases' ? this._phrasesPrompt() : this._wordsPrompt()
    const cardType = type === 'phrases' ? 'phrase' : 'word'

    const response = await this.oAi().responses.parse({
      model: this.model,
      text: {
        format: zodTextFormat(LearnablesFromAiSchema, 'learnable_cards')
      },
      input: [
        { role: 'system', content: prompt },
        {
          role: 'user',
          content: 'transfer the follwing into cards: ' + userInput
        }
      ]
    })

    this.settingsStore.addTokensUsed(response.usage?.total_tokens ?? 0)
    const cards = response.output_parsed?.cards || []

    return cards.map((c) => ({
      lexeme: c.lexeme,
      translation: c.translation,
      notes: '',
      type: cardType
    }))
  }
}
