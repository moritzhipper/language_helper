import { DatePipe } from '@angular/common'
import { Component, input, model } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
  LearnableCollection,
  LearnablePsuedoCollection
} from '../../../../types_and_schemas/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-collection-info-comp',
  imports: [DatePipe, IconComp, FormsModule],
  templateUrl: './collection-info-comp.html',
  styleUrl: './collection-info-comp.scss'
})
export class CollectionInfoComp {
  selectedCollection = input.required<
    LearnableCollection | LearnablePsuedoCollection
  >()
  selectedCollectionId = model<string>()
  averageConfidence = input.required<number>()
  selectionOptions = input.required<{ id: string; name: string }[]>()
}
