import { Component, inject } from '@angular/core'
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-add-bank-comp',
  imports: [ReactiveFormsModule],
  templateUrl: './add-bank-comp.html',
  styleUrl: './add-bank-comp.scss'
})
export class AddBankComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)

  protected form = this._fb.group({
    name: ['', Validators.required],
    speaking: ['', Validators.required],
    learning: ['', Validators.required]
  })

  submit() {
    if (this.form.invalid) return
    const { name, speaking, learning } = this.form.value

    this.confirm({
      name,
      language: { speaking, learning }
    })
  }
}
