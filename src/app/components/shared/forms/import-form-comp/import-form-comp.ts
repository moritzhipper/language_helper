import { Component, computed, input } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BankExport } from '../../../../types_and_schemas/types'
import { getCollectionlessLearnableIds } from '../../../../utils/genaral-utils'
import { IconComp } from '../../icon-comp/icon-comp'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-import-form-comp',
  imports: [ReactiveFormsModule, IconComp],
  templateUrl: './import-form-comp.html',
  styleUrl: './import-form-comp.scss'
})
export class ImportFormComp extends BaseModalDirective {
  private readonly PREVIEW_COUNT = 20
  bankExport = input.required<BankExport>()

  protected unsortedLearnablesCount = computed(() => {
    const { learnables, collections } = this.bankExport()

    return getCollectionlessLearnableIds(learnables, collections).length
  })

  protected cutoffCount = computed(
    () => this.bankExport().learnables.length - this.PREVIEW_COUNT
  )

  protected previewCards = computed(() =>
    this.bankExport()
      .learnables.map((l) => l.translation)
      .slice(0, this.PREVIEW_COUNT + 1)
  )

  protected collectionNames = computed(() => {
    const normalNames = this.bankExport().collections.map((c) => c.name)
    const hasUnsorted = getCollectionlessLearnableIds(
      this.bankExport().learnables,
      this.bankExport().collections
    ).length
    if (!hasUnsorted) return normalNames
    return normalNames.concat(['Unsorted'])
  })
}
