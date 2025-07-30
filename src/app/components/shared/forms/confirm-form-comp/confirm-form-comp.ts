import { Component, input } from '@angular/core'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-confirm-form-comp',
  imports: [],
  templateUrl: './confirm-form-comp.html',
  styleUrl: './confirm-form-comp.scss'
})
export class ConfirmFormComp extends BaseModalDirective {
  message = input<string | null>(null)
  label = input<string>('confirm')
}
