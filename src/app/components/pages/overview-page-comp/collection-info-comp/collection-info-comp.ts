import { DatePipe } from '@angular/common'
import { Component, input } from '@angular/core'
import { FormsModule } from '@angular/forms'

type Config = {
  header: string
  cardCount: number
  averageConfidence: number
  date?: Date
}

@Component({
  selector: 'app-collection-info-comp',
  imports: [DatePipe, FormsModule],
  templateUrl: './collection-info-comp.html',
  styleUrl: './collection-info-comp.scss'
})
export class CollectionInfoComp {
  config = input.required<Config>()
}
