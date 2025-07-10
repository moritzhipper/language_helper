import { Component, inject, input, output, signal } from '@angular/core'
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { AiService } from '../../../../services/ai.service'
import {
  LearnableBase,
  LearnableCreationConfig
} from '../../../../types_and_schemas/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'

@Component({
  selector: 'app-magic-add-comp',
  imports: [RadioComp, IconComp, ReactiveFormsModule],
  templateUrl: './magic-add-comp.html',
  styleUrl: './magic-add-comp.scss'
})
export class MagicAddComp {
  private readonly _fb = inject(NonNullableFormBuilder)
  private readonly aiS = inject(AiService)

  isConverting = signal(false)

  excludedWords = input.required<string[]>()
  cancel = output<void>()
  confirm = output<LearnableBase[]>()

  convertForm = this._fb.group({
    text: ['', Validators.required],
    allowType: 'both'
  })

  async convert() {
    if (this.isConverting()) return

    const text = this.convertForm.value.text
    const allowType = this.convertForm.value.allowType
    const allowWords = allowType === 'words' || allowType === 'both'
    const allowPhrases = allowType === 'phrases' || allowType === 'both'

    if (this.convertForm.invalid || !text) return
    const config: LearnableCreationConfig = {
      text,
      allowWords,
      allowPhrases
    }

    this.isConverting.set(true)

    const baseLearnables = await this.aiS.createLearnablesFromString(
      config,
      this.excludedWords()
    )

    this.isConverting.set(false)
    this.confirm.emit(baseLearnables)
    this.convertForm.reset()
  }

  onCancel() {
    this.cancel.emit()
    this.convertForm.reset()
  }

  reset() {
    this.convertForm.reset()
  }
}
