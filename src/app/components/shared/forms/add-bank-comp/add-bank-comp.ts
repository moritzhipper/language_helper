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
    name: [''],
    speaking: ['', Validators.required],
    learning: ['', Validators.required]
  })
}
