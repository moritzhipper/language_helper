import { Component, inject, input } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { BankUser } from '../../../../types_and_schemas/types'
import { RadioComp } from '../../radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

export type ShareFormResponse = {
  ttlMinutes: number
}

@Component({
  selector: 'app-share-form-comp',
  imports: [ReactiveFormsModule, RadioComp],
  templateUrl: './share-form-comp.html',
  styleUrl: './share-form-comp.scss'
})
export class ShareFormComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)
  form = this._fb.group<ShareFormResponse>({
    ttlMinutes: 5
  })

  bank = input.required<BankUser>()
}
