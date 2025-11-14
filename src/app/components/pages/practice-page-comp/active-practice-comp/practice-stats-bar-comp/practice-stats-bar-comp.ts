import { Component, model } from '@angular/core'
import { IconComp } from '../../../../shared/icon-comp/icon-comp'

export type ActivePracticeSummary = {
  correctGuesses: number
  guessesDone: number
  guessesLeft: number
  progressPercent: number
}

@Component({
  selector: 'app-practice-stats-bar-comp',
  imports: [IconComp],
  templateUrl: './practice-stats-bar-comp.html',
  styleUrl: './practice-stats-bar-comp.scss'
})
export class PracticeStatsBarComp {
  isOpen = model<boolean>(true)

  toggle() {
    this.isOpen.update((o) => !o)
  }
}
