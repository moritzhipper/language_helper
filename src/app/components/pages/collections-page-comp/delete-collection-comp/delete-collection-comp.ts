import { Component, inject, output } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'

export type ConfirmCollectionDeletionType = {
  deletionType: 'dissolve' | 'remove'
}

@Component({
  selector: 'app-delete-collection-comp',
  imports: [ReactiveFormsModule, RadioComp],
  templateUrl: './delete-collection-comp.html',
  styleUrl: './delete-collection-comp.scss'
})
export class DeleteCollectionComp {
  private readonly _fb = inject(NonNullableFormBuilder)

  confirm = output<ConfirmCollectionDeletionType>()
  cancel = output<void>()

  form = this._fb.group<ConfirmCollectionDeletionType>({
    deletionType: 'dissolve'
  })

  onConfirm() {
    this.form.reset()
    this.confirm.emit(this.form.value as ConfirmCollectionDeletionType)
  }

  onCancel() {
    this.form.reset()
    this.cancel.emit()
  }
}
