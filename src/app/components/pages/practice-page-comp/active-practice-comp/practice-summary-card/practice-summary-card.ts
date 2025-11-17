import { Component, computed, input } from '@angular/core'
import { PracticeRatingComp } from '../practice-rating-comp/practice-rating-comp'

export type PracticeRating =
  | 'noteven'
  | 'atleast'
  | 'okay'
  | 'good'
  | 'excellent'

export type ActivePracticeSummary = {
  correctGuesses: number
  wrongGuesses: number
  unansweredGuesses: number
  guessedRightPercent: number
  rating: PracticeRating
}

@Component({
  selector: 'app-practice-summary-card',
  imports: [PracticeRatingComp],
  templateUrl: './practice-summary-card.html',
  styleUrl: './practice-summary-card.scss',
  host: {
    '[class]': 'summary().rating'
  }
})
export class PracticeSummaryCard {
  summary = input.required<ActivePracticeSummary>()

  texts = computed(() => this.textConfig[this.summary().rating])

  private readonly textConfig: Record<
    PracticeRating,
    { title: string; subtitle: string }
  > = {
    noteven: {
      title: 'Well...',
      subtitle: 'you showed up!'
    },
    atleast: {
      title: 'You tried!',
      subtitle: 'Thats something'
    },
    okay: {
      title: 'Not Bad!',
      subtitle: 'You are getting there'
    },
    good: {
      title: 'Well Done!',
      subtitle: 'Great job'
    },
    excellent: {
      title: 'Excellent!',
      subtitle: 'So great'
    }
  }
}
