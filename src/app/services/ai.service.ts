import { computed, inject, Injectable } from '@angular/core'
import OpenAI from 'openai'
// import { zodTextFormat } from 'openai/helpers/zod'
import { ChatModel } from 'openai/resources/shared.mjs'
import { SettingsStore } from '../store/settingsStore'
import { LearnableResonseSchema } from '../types_and_schemas/schemas'
import {
  LearnableBase,
  LearnableCreationConfig
} from '../types_and_schemas/types'
import { zodTextFormat } from '../utils/genaral-utils'
import { getCreateLearnablesPrompt, getSystemPrompt } from './prompts'

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

  private readonly systemPrompt = computed(() =>
    getSystemPrompt(
      this.settingsStore.learningLang(),
      this.settingsStore.speakingLang()
    )
  )

  async createLearnablesFromString(
    config: LearnableCreationConfig,
    excludedWords: string[]
  ): Promise<LearnableBase[]> {
    const learnablesPrompt = getCreateLearnablesPrompt(
      this.settingsStore.learningLang(),
      this.settingsStore.speakingLang(),
      excludedWords,
      config.allowWords,
      config.allowPhrases
    )

    const systemPrompt = this.systemPrompt()

    const response = await this.oAi().responses.parse({
      model: this.model,
      text: {
        format: zodTextFormat(LearnableResonseSchema, 'learnable_base')
      },
      input: [
        systemPrompt,
        learnablesPrompt,
        { role: 'user', content: config.text }
      ]
    })

    this.settingsStore.addTokensUsed(response.usage?.total_tokens)

    const learnablesBase = response.output_parsed
    if (!learnablesBase) {
      console.error('No parsed output received from AI', response)
      throw new Error('No parsed output received from AI')
    }
    return learnablesBase.learnables.map((l) => ({ ...l, notes: '' }))
  }

  async useInSentence(word: string): Promise<string> {
    // const messages = await this.oAi().chat.completions.create({
    //   model: this.model,
    //   messages: [this.systemPrompt(), getUseInSentencePrompt(word)]
    // })

    return ''
  }
}
