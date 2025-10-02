import { DatePipe } from '@angular/common'
import { Component, input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
  LearnableBaseCollection,
  LearnableUserCollection
} from '../../../../types_and_schemas/types'

@Component({
  selector: 'app-collection-info-comp',
  imports: [DatePipe, FormsModule],
  templateUrl: './collection-info-comp.html',
  styleUrl: './collection-info-comp.scss'
})
export class CollectionInfoComp {
  selectedCollection = input.required<
    LearnableUserCollection | LearnableBaseCollection
  >()
  averageConfidence = input.required<number>()
}
