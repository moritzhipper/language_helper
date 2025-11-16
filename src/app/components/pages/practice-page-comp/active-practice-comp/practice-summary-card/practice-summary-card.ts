import { Component, input } from '@angular/core'

export type ActivePracticeSummary = {
  correctGuesses: number
  wrongGuesses: number
  unansweredGuesses: number
  guessedRightPercent: number
}

@Component({
  selector: 'app-practice-summary-card',
  imports: [],
  templateUrl: './practice-summary-card.html',
  styleUrl: './practice-summary-card.scss'
})
export class PracticeSummaryCard {
  summary = input.required<ActivePracticeSummary>()
}
