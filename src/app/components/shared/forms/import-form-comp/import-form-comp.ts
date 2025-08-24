import { Component, computed, input } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { StoreExport } from '../../../../types_and_schemas/types'
import { getCollectionlessLearnableIds } from '../../../../utils/genaral-utils'
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
    const { learnables, collections } = this.storeExport()

    return getCollectionlessLearnableIds(learnables, collections).length
  })
}
