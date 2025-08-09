import { Component, effect, inject, input, untracked } from '@angular/core'
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { LearnableBase } from '../../../../types_and_schemas/types'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-single-edit-comp',
  imports: [ReactiveFormsModule, RadioComp],
  templateUrl: './single-edit-comp.html',
  styleUrl: './single-edit-comp.scss'
})
export class SingleEditComp extends BaseModalDirective {
  private _fb = inject(NonNullableFormBuilder)

  learnable = input.required<LearnableBase>()

  form = this._fb.group({
    lexeme: ['', Validators.required],
    translation: ['', Validators.required],
    type: ['word', Validators.required],
    notes: ''
  })

  constructor() {
    super()
    effect(() => {
      const learnable = this.learnable()

      untracked(() => {
        this.form.patchValue({
          lexeme: learnable.lexeme,
          translation: learnable.translation,
          type: learnable.type,
          notes: learnable.notes
        })
      })
    })
  }
}
