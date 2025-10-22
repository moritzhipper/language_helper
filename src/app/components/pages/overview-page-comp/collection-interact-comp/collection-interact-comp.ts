import { Component, effect, input, model, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Downloadable } from '../../../../services/blob-service'
import { LearnableUserCollection } from '../../../../types_and_schemas/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-collection-interact-comp',
  imports: [IconComp, FormsModule],
  templateUrl: './collection-interact-comp.html',
  styleUrl: './collection-interact-comp.scss'
})
export class CollectionInteractComp {
  selectableCollections = input.required<LearnableUserCollection[]>()
  selectedCollectionId = model.required<string | null>()

  test = effect(() => {
    console.log(
      'selectedCollectionId changed:',
      typeof this.selectedCollectionId(),
      this.selectedCollectionId()
    )
  })

  downloadable = input<Downloadable | null>(null)
  edit = output<void>()
  delete = output<void>()
  share = output<void>()
}
