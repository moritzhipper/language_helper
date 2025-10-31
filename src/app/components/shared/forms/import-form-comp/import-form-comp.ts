import { Component, computed, input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BankExport } from '../../../../types_and_schemas/types'
import { getCollectionlessLearnableIds } from '../../../../utils/genaral-utils'
import { BaseModalDirective } from '../base-modal-directive'

type CollectionPreview = {
  name: string
  lexemes: string[]
}

@Component({
  selector: 'app-import-form-comp',
  imports: [ReactiveFormsModule],
  templateUrl: './import-form-comp.html',
  styleUrl: './import-form-comp.scss'
})
export class ImportFormComp extends BaseModalDirective {
  private readonly PREVIEW_COUNT = 20
  bankExport = input.required<BankExport>()
  form = new FormGroup({})

  protected unsortedLearnablesCount = computed(() => {
    const { learnables, collections } = this.bankExport()
    return getCollectionlessLearnableIds(learnables, collections).length
  })

  collectionPreviews = computed<CollectionPreview[]>(() => {
    const { learnables, collections } = this.bankExport()

    const previews = collections.map((c) => {
      const lexemes = learnables
        .filter((l) => c.learnableIDs.includes(l.id))
        .slice(0, this.PREVIEW_COUNT)
        .map((l) => l.lexeme)

      return {
        name: c.name,
        lexemes
      }
    })

    const unsortedLexemes = getCollectionlessLearnableIds(
      learnables,
      collections
    )

    if (unsortedLexemes.length > 0) {
      const unsortedPreviewLexemes = learnables
        .filter((l) => unsortedLexemes.includes(l.id))
        .slice(0, this.PREVIEW_COUNT)
        .map((l) => l.lexeme)

      previews.push({
        name: 'Unsorted',
        lexemes: unsortedPreviewLexemes
      })
    }

    return previews
  })
}
