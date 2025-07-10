import { Component, input, output } from '@angular/core'

@Component({
  selector: 'app-confirm-form-comp',
  imports: [],
  templateUrl: './confirm-form-comp.html',
  styleUrl: './confirm-form-comp.scss'
})
export class ConfirmFormComp {
  label = input<string>('confirm')
  cancel = output<void>()
  confirm = output<void>()

  onCancel() {
    this.cancel.emit()
  }
  onConfirm() {
    this.confirm.emit()
  }
}
