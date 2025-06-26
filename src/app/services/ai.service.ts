import { Injectable } from '@angular/core'
import OpenAI from 'openai'
import { ChatModel } from 'openai/resources/shared.mjs'
import { LearnableBase } from '../../types_and_schemas/types'

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly model: ChatModel = 'chatgpt-4o-latest'

  private readonly oAi = new OpenAI({
    apiKey: '',
  })

  async createLearnablesFromString(
    string: string,
    excludedWords: string[]
  ): Promise<LearnableBase[]> {
    const messages = await this.oAi.chat.completions.create({
      model: this.model,
      messages: [],
    })

    return []
  }

  async useInSentence(word: string): Promise<string> {
    const messages = await this.oAi.chat.completions.create({
      model: this.model,
      messages: [],
    })

    return ''
  }
}
