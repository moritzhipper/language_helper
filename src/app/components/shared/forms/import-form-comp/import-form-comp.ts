import { Component, computed, input } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BankExport } from '../../../../types_and_schemas/types'
import { getCollectionlessLearnableIds } from '../../../../utils/genaral-utils'
import { BaseModalDirective } from '../base-modal-directive'

@Component({
  selector: 'app-import-form-comp',
  imports: [ReactiveFormsModule],
  templateUrl: './import-form-comp.html',
  styleUrl: './import-form-comp.scss'
})
export class ImportFormComp extends BaseModalDirective {
  bankExport = input.required<BankExport>()

  protected unsortedLearnablesCount = computed(() => {
    const { learnables, collections } = this.bankExport()

    return getCollectionlessLearnableIds(learnables, collections).length
  })
}
