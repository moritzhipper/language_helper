import { computed, inject, Injectable } from '@angular/core'
import OpenAI from 'openai'
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

  async createLearnablesFromString(
    config: LearnableCreationConfig
  ): Promise<LearnableBase[]> {
    const prompt = this._getSystemPrompt(config.type)
    const cardPromises: Promise<LearnableBaseFromAi[]>[] = []
    // when both, do call phrase and cards, if one of them, call one of them
    // chatgpt skips a lot of input when doing both at once
    if (config.type === 'both') {
      cardPromises.push(
        this._createCards(config.input, 'phrases'),
        this._createCards(config.input, 'words')
      )
    } else {
      cardPromises.push(this._createCards(config.input, config.type))
    }

    const cards = await (await Promise.all(cardPromises)).flatMap((c) => c)

    return cards.map((l) => ({ ...l, notes: '' }))
  }

  private async _createCards(
    userInput: string,
    type: LearnableCreationConfig['type']
  ) {
    const prompt = this._getSystemPrompt(type)

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

  private _getSystemPrompt(type: LearnableCreationConfig['type']) {
    return type === 'phrases'
      ? getPhrasesPrompt(
          this.settingsStore.learningLang(),
          this.settingsStore.speakingLang()
        )
      : getWordsPrompt(
          this.settingsStore.learningLang(),
          this.settingsStore.speakingLang()
        )
  }
}
