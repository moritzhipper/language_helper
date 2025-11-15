import { Component, input } from '@angular/core'
import { LearnableBase } from '../../../../../types_and_schemas/types'

@Component({
  selector: 'app-practice-card-comp',
  imports: [],
  templateUrl: './practice-card-comp.html',
  styleUrl: './practice-card-comp.scss'
})
export class PracticeCardComp {
  learnable = input.required<LearnableBase>()
  reverseDirection = input.required<boolean>()
}
