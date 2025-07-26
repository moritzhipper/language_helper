import { computed, inject, Injectable } from '@angular/core'
import OpenAI from 'openai'
// import { zodTextFormat } from 'openai/helpers/zod'
import { ChatModel } from 'openai/resources/shared.mjs'
import { SettingsStore } from '../store/settingsStore'
import { LearnableResponseSchema } from '../types_and_schemas/schemas'
import {
  LearnableBase,
  LearnableCreationConfig
} from '../types_and_schemas/types'
import { zodTextFormat } from '../utils/genaral-utils'
import {
  getPhrasesPrompt,
  getWordsAndPhrasesPrompt,
  getWordsPrompt
} from './ai-prompts/prompt'

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
    debugger
    const cards = await this._createCards(config.input, prompt)

    return cards.map((l) => ({ ...l, notes: '' }))
  }

  private async _createCards(userInput: string, systemPrompt: string) {
    const response = await this.oAi().responses.parse({
      model: this.model,
      text: {
        format: zodTextFormat(LearnableResponseSchema, 'learnable_base')
      },
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput }
      ]
    })

    this.settingsStore.addTokensUsed(response.usage?.total_tokens ?? 0)

    return response.output_parsed?.learnables || []
  }

  private _getSystemPrompt(type: LearnableCreationConfig['type']) {
    if (type === 'phrases') {
      return getPhrasesPrompt(
        this.settingsStore.learningLang(),
        this.settingsStore.speakingLang()
      )
    } else if (type === 'words') {
      return getWordsPrompt(
        this.settingsStore.learningLang(),
        this.settingsStore.speakingLang()
      )
    }
    return getWordsAndPhrasesPrompt(
      this.settingsStore.learningLang(),
      this.settingsStore.speakingLang()
    )
  }
}
