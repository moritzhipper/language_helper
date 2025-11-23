import { Component, input } from '@angular/core'
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
}
