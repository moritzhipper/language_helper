import { Component, computed, input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BankShare } from '../../../../types_and_schemas/types'
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
  bankExport = input.required<BankShare>()
  form = new FormGroup({})

  collectionPreviews = computed<CollectionPreview[]>(() => {
    const { learnables, collections } = this.bankExport()

    const previews = collections.map((c) => ({
      name: c.name,
      learnablesCount: learnables.filter((l) => c.cardIds.includes(l.id)).length
    }))

    const allCollectionCardIds = new Set(collections.flatMap((c) => c.cardIds))
    const collectionLessCount = learnables.filter(
      (l) => !allCollectionCardIds.has(l.id)
    ).length

    if (collectionLessCount === 0) return previews

    previews.push({
      name: 'No Collection',
      learnablesCount: collectionLessCount
    })

    return previews
  })
}
