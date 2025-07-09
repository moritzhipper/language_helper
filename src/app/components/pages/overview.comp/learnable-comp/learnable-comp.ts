import { DatePipe } from '@angular/common'
import { Component, computed, input } from '@angular/core'
import { Learnable } from '../../../../types_and_schemas/types'
import { newerThanOneDay } from '../../../../utils/learnables-filter'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-learnable-comp',
  imports: [DatePipe, IconComp],
  templateUrl: './learnable-comp.html',
  styleUrl: './learnable-comp.scss'
})
export class LearnableComp {
  learnable = input.required<Learnable>()
  newerThanOneDay = computed(() => newerThanOneDay(this.learnable().created))
}
