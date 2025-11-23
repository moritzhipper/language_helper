import { Component, computed, input } from '@angular/core'
import { IconComp } from '../../../../shared/icon-comp/icon-comp'
import { PracticeRating } from '../practice-summary-card/practice-summary-card'

@Component({
  selector: 'app-practice-rating-comp',
  imports: [IconComp],
  templateUrl: './practice-rating-comp.html',
  styleUrl: './practice-rating-comp.scss',
  host: {
    '[class]': 'rating()'
  }
})
export class PracticeRatingComp {
  rating = input.required<PracticeRating>()

  texts = computed(() => this.textConfig[this.rating()])

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
