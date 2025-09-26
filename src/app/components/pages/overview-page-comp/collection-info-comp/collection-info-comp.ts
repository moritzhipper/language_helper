import { DatePipe } from '@angular/common'
import { Component, input } from '@angular/core'
import {
  LearnableCollection,
  LearnablePsuedoCollection
} from '../../../../types_and_schemas/types'

@Component({
  selector: 'app-collection-info-comp',
  imports: [DatePipe],
  templateUrl: './collection-info-comp.html',
  styleUrl: './collection-info-comp.scss'
})
export class CollectionInfoComp {
  collection = input.required<LearnableCollection | LearnablePsuedoCollection>()
}
