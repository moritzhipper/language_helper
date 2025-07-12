import { DatePipe } from '@angular/common'
import { Component, input } from '@angular/core'
import { Learnable } from '../../../types_and_schemas/types'

@Component({
  selector: 'app-learnable-comp',
  imports: [DatePipe],
  templateUrl: './learnable-comp.html',
  styleUrl: './learnable-comp.scss'
})
export class LearnableComp {
  learnable = input.required<Learnable>()
}
