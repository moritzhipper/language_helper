import { Component, inject, output } from '@angular/core'
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'

@Component({
  selector: 'app-edit-collection-comp',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-collection-comp.html',
  styleUrl: './edit-collection-comp.scss'
})
export class EditCollectionComp {
  private _fb = inject(NonNullableFormBuilder)

  form = this._fb.group({
    name: ['', Validators.required]
  })

  confirm = output<string>()
  cancel = output<void>()

  onConfirm() {
    const { name } = this.form.value
    if (!name) return
    this.confirm.emit(name)
    this.form.reset()
  }

  onCancel() {
    this.cancel.emit()
    this.form.reset()
  }
}
