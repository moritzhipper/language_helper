import { Component, computed, input, model, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Downloadable } from '../../../../services/blob-service'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-collection-interact-comp',
  imports: [IconComp, FormsModule],
  templateUrl: './collection-interact-comp.html',
  styleUrl: './collection-interact-comp.scss'
})
export class CollectionInteractComp {
  selectionOptions = input.required<{ id: string; name: string }[]>()
  selectedCollectionId = model<string>()
  selectorOnly = input<boolean>(false)

  downloadable = input<Downloadable | undefined>()
  edit = output<void>()
  delete = output<void>()
  share = output<void>()

  selectButtonOptions = computed(() => {
    return this.selectionOptions().filter(
      (o) => o.id !== this.selectedCollectionId()
    )
  })
}
