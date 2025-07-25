import { Component, inject, input, output, signal } from '@angular/core'
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { AiService } from '../../../../services/ai.service'
import { ToastService } from '../../../../services/toast-service'
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
  private toastService = inject(ToastService)

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

    try {
      const baseLearnables = await this.aiS.createLearnablesFromString(
        config,
        this.excludedWords()
      )

      this.toastService.showToast({
        message: `Created ${baseLearnables.length} new learnables!`,
        type: 'info'
      })

      this.confirm.emit(baseLearnables)
      this.reset()
    } catch (error) {
      this.isConverting.set(false)

      const message = error instanceof Error ? error.message : 'Unknown error'
      this.toastService.showToast({
        message,
        type: 'error'
      })

      console.error('Error creating learnables:', error)
    }
  }

  onCancel() {
    this.cancel.emit()
    this.reset()
  }

  reset() {
    this.isConverting.set(false)
    this.convertForm.reset()
  }
}
