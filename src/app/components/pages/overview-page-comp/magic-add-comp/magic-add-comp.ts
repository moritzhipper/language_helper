import { Component, inject, output, signal } from '@angular/core'
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

  cancel = output<void>()
  confirm = output<LearnableBase[]>()

  convertForm = this._fb.group({
    input: ['', Validators.required],
    type: 'both'
  })

  async convert() {
    if (this.isConverting()) return
    const formValue = this.convertForm.value

    const creationConf = {
      input: formValue.input,
      type: formValue.type
    } as LearnableCreationConfig

    try {
      this.isConverting.set(true)
      const baseLearnables =
        await this.aiS.createLearnablesFromString(creationConf)

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
