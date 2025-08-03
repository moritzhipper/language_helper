import { Component, input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-confirm-form-comp',
  imports: [ReactiveFormsModule],
  templateUrl: './confirm-form-comp.html',
  styleUrl: './confirm-form-comp.scss'
})
export class ConfirmFormComp extends BaseModalDirective {
  message = input<string | null>(null)
  label = input<string>('confirm')
  form = new FormGroup({})
}
