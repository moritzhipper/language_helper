import { Component, computed, input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BankExportOffline } from '../../../../types_and_schemas/types'
import { BaseModalDirective } from '../base-modal-directive'

type CollectionPreview = {
  name: string
  learnablesCount: number
}

@Component({
  selector: 'app-import-form-comp',
  imports: [ReactiveFormsModule],
  templateUrl: './import-form-comp.html',
  styleUrl: './import-form-comp.scss'
})
export class ImportFormComp extends BaseModalDirective {
  bankExport = input.required<BankExportOffline>()
  form = new FormGroup({})

  collectionPreviews = computed<CollectionPreview[]>(() => {
    const { learnables, collections } = this.bankExport().bank

    const previews = collections.map((c) => ({
      name: c.name,
      learnablesCount: learnables.filter((l) => l.collectionIds.includes(c.id))
        .length
    }))

    const collectionLessCount = learnables.filter(
      (l) => l.collectionIds.length === 0
    ).length

    if (collectionLessCount === 0) return previews

    previews.push({
      name: 'No Collection',
      learnablesCount: collectionLessCount
    })

    return previews
  })
}
