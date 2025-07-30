import { Component, inject, input, output } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { LearnableCollection } from '../../../../types_and_schemas/types'

export type ConfirmCollectionAddType = {
  createName?: string
  addToId?: string
}

@Component({
  selector: 'app-collection-add-comp',
  imports: [ReactiveFormsModule],
  templateUrl: './collection-add-comp.html',
  styleUrl: './collection-add-comp.scss'
})
export class CollectionAddComp {
  private readonly _fb = inject(NonNullableFormBuilder)

  form = this._fb.group({
    create: [''],
    addToId: ['']
  })

  collections = input.required<LearnableCollection[]>()
  cancel = output<void>()
  confirm = output<ConfirmCollectionAddType>()

  resetCollectionSelection() {
    this.form.patchValue({ addToId: '' })
  }

  onConfirm() {
    const { create, addToId } = this.form.value

    if (addToId) {
      this.confirm.emit({ addToId })
    } else if (create) {
      this.confirm.emit({ createName: create })
    }
    this._reset()
  }

  onCancel() {
    this.cancel.emit()
    this._reset()
  }

  private _reset() {
    this.form.reset()
  }
}
