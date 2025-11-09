import { Component, inject, input, signal } from '@angular/core'
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { AiService } from '../../../../services/ai/ai.service'
import { ToastService } from '../../../../services/toast-service'
import {
  LanguageConfig,
  LearnableCreationConfig
} from '../../../../types_and_schemas/types'
import { IconComp } from '../../icon-comp/icon-comp'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-magic-add-comp',
  imports: [RadioComp, IconComp, ReactiveFormsModule],
  templateUrl: './magic-add-comp.html',
  styleUrl: './magic-add-comp.scss'
})
export class MagicAddComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)
  private readonly _aiS = inject(AiService)
  private toastService = inject(ToastService)

  language = input.required<LanguageConfig>()

  isConverting = signal(false)

  convertForm = this._fb.group({
    input: ['', Validators.required],
    type: 'words'
  })

  async convert() {
    const formValue = this.convertForm.value

    const creationConf = {
      input: formValue.input,
      type: formValue.type,
      language: this.language()
    } as LearnableCreationConfig

    try {
      this.isConverting.set(true)
      const baseLearnables =
        await this._aiS.createLearnablesFromString(creationConf)
      console.log(baseLearnables)

      this.confirm(baseLearnables)
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
}
