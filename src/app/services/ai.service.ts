import { computed, inject, Injectable } from '@angular/core'
import OpenAI from 'openai'
import { ChatModel } from 'openai/resources/shared.mjs'
import { SettingsStore } from '../store/settingsStore'
import { LearnableBase } from '../types_and_schemas/types'
import {
  getCreateLearnablesPrompt,
  getSystemPrompt,
  getUseInSentencePrompt,
} from './prompts'

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly model: ChatModel = 'chatgpt-4o-latest'
  private readonly setingsStore = inject(SettingsStore)

  private oAi = computed(
    () =>
      new OpenAI({
        apiKey: this.setingsStore.apiKey(),
      })
  )

  private readonly systemPrompt = computed(() =>
    getSystemPrompt(
      this.setingsStore.learningLang(),
      this.setingsStore.speakingLang()
    )
  )

  async createLearnablesFromString(
    string: string,
    excludedWords: string[]
  ): Promise<LearnableBase[]> {
    const messages = await this.oAi().chat.completions.create({
      model: this.model,
      messages: [
        this.systemPrompt(),
        getCreateLearnablesPrompt(excludedWords),
        { role: 'user', content: string },
      ],
    })

    return []
  }

  async useInSentence(word: string): Promise<string> {
    const messages = await this.oAi().chat.completions.create({
      model: this.model,
      messages: [this.systemPrompt(), getUseInSentencePrompt(word)],
    })

    return ''
  }
}
