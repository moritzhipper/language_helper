import { Component, input, output } from '@angular/core'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-edit-bubbles-comp',
  imports: [IconComp],
  templateUrl: './edit-bubbles-comp.html',
  styleUrl: './edit-bubbles-comp.scss'
})
export class EditBubblesComp {
  allowRemoveFromCollection = input.required<boolean>()
  selectedCardsCount = input.required<number>()

  removeFromCollection = output<void>()
  addToCollection = output<void>()
  bulkEdit = output<void>()
  delete = output<void>()
  create = output<void>()
  resetSelection = output<void>()
}
