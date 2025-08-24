import { Component, computed, input } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { StoreExport } from '../../../../types_and_schemas/types'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-import-form-comp',
  imports: [ReactiveFormsModule],
  templateUrl: './import-form-comp.html',
  styleUrl: './import-form-comp.scss'
})
export class ImportFormComp extends BaseModalDirective {
  storeExport = input.required<StoreExport>()

  protected unsortedLearnablesCount = computed(() => {
    const lExport = this.storeExport()
    const allLearnableIdsSet = new Set(
      lExport.learnables.map((learnable) => learnable.id)
    )
    const learnablesInCollectionsSet = new Set(
      lExport.collections.flatMap((collection) => collection.learnableIDs)
    )

    return allLearnableIdsSet.size - learnablesInCollectionsSet.size
  })
}
