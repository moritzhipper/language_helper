import { Component, inject, input } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { CollectionUser } from '../../../../types_and_schemas/types'
import { BaseModalDirective } from '../base-modal-directive'

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
export class CollectionAddComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)

  form = this._fb.group({
    createName: [''],
    addToId: ['']
  })

  collections = input.required<CollectionUser[]>()

  resetCollectionSelection() {
    this.form.patchValue({ addToId: '' })
  }
}
