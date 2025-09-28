import { DatePipe } from '@angular/common'
import { Component, input } from '@angular/core'
import {
  LearnableCollection,
  LearnablePsuedoCollection
} from '../../../../types_and_schemas/types'
import { CounterComp } from '../../../shared/counter-comp/counter-comp'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-collection-info-comp',
  imports: [DatePipe, IconComp, CounterComp],
  templateUrl: './collection-info-comp.html',
  styleUrl: './collection-info-comp.scss'
})
export class CollectionInfoComp {
  collection = input.required<LearnableCollection | LearnablePsuedoCollection>()
  confidencePercent = input<number>(0)
}
