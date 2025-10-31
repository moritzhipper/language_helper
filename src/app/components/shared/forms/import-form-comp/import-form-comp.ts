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

  collectionPreviews = computed<CollectionPreview[]>(() => {
    const { learnables, collections } = this.bankExport()

    const previews = collections.map((c) =>
      this.getPreviewLexemes(c.name, learnables, c.learnableIDs)
    )

    const unsortedIDs = getCollectionlessLearnableIds(learnables, collections)

    if (unsortedIDs.length > 0) {
      previews.push(this.getPreviewLexemes('Unsorted', learnables, unsortedIDs))
    }

    return previews
  })

  private getPreviewLexemes(
    name: string,
    learnables: BankExport['learnables'],
    learnableIds: string[]
  ): CollectionPreview {
    const lexemes = learnables
      .filter((l) => learnableIds.includes(l.id))
      .slice(0, this.PREVIEW_COUNT)
      .map((l) => l.lexeme)

    return {
      name,
      lexemes
    }
  }
}
