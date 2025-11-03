import { DatePipe } from '@angular/common'
import { Component, computed, input } from '@angular/core'
import { UserLearnable } from '../../../../types_and_schemas/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-learnable-comp',
  imports: [DatePipe, IconComp],
  templateUrl: './learnable-comp.html',
  styleUrl: './learnable-comp.scss',
  host: {
    '[class.small-text]': 'hasManyLetters()'
  }
})
export class LearnableComp {
  learnable = input.required<UserLearnable>()
  showNewBadge = input<boolean>(false)
  hasManyLetters = computed(() => {
    const lexemeLengt = this.learnable().lexeme.length
    const translationLength = this.learnable().translation.length
    const notesLength = this.learnable().notes.length
    const sum = lexemeLengt + translationLength + notesLength
    return sum > 150
  })
}
