import { Component, input, model } from '@angular/core'
import { FormsModule } from '@angular/forms'
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
}
