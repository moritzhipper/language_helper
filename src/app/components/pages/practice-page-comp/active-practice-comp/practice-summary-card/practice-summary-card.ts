import { Component, input } from '@angular/core'
import { Practice } from '../../../../../types_and_schemas/types'

export type ActivePracticeSummary = {
  correctGuesses: number
  guessesDone: number
  guessesLeft: number
  progressPercent: number
}

@Component({
  selector: 'app-practice-summary-card',
  imports: [],
  templateUrl: './practice-summary-card.html',
  styleUrl: './practice-summary-card.scss'
})
export class PracticeSummaryCard {
  summary = input.required<Practice>()
}
