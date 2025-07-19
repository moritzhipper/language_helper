import { DatePipe } from '@angular/common'
import { Component, input } from '@angular/core'
import { LearnableCollection } from '../../../../types_and_schemas/types'

@Component({
  selector: 'app-collection-comp',
  templateUrl: './collection-comp.html',
  imports: [DatePipe],
  styleUrl: './collection-comp.scss'
})
export class CollectionComp {
  collection = input.required<LearnableCollection>()
  avgGuessesPercent = input.required<number>()
}
