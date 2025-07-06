import { DatePipe } from '@angular/common'
import { Component, computed, input } from '@angular/core'
import { Learnable } from '../../../../types_and_schemas/types'

@Component({
  selector: 'app-learnable-comp',
  imports: [DatePipe],
  templateUrl: './learnable-comp.html',
  styleUrl: './learnable-comp.scss'
})
export class LearnableComp {
  learnable = input.required<Learnable>()

  sortedGuesses = computed(() => {
    const guesses = this.learnable().lastGuesses
    return this.sortGuesses(guesses)
  })

  private sortGuesses(guesses: boolean[]) {
    return guesses.sort((a, b) => {
      if (a && !b) return 1
      if (!a && b) return -1
      return 0
    })
  }
}
