import { Component, computed, input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BankBase, BankExportOnline } from '../../../../types_and_schemas/types'
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
  private readonly PREVIEW_COUNT = 20
  bankExport = input.required<BankExportOnline>()
  form = new FormGroup({})

  collectionPreviews = computed<CollectionPreview[]>(() => {
    const { learnables, collections } = this.bankExport().bank

    return collections.map((c) => ({
      name: c.name,
      learnablesCount: learnables.filter((l) => l.collectionIds.includes(c.id))
        .length
    }))
  })

  private getPreviewLexemes(
    name: string,
    learnables: BankBase['learnables'],
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
