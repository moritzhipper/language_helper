import { Component, input, model, output } from '@angular/core'
import { IconComp } from '../../../../shared/icon-comp/icon-comp'
import { FocusCardState } from '../active-practice-comp'

@Component({
  selector: 'app-practice-stats-bar-comp',
  imports: [IconComp],
  templateUrl: './practice-stats-bar-comp.html',
  styleUrl: './practice-stats-bar-comp.scss'
})
export class PracticeStatsBarComp {
  isOpen = model<boolean>()
  isFinished = input.required<boolean>()
  cardState = input.required<FocusCardState>()
  edit = output<void>()
  quit = output<void>()

  toggle() {
    this.isOpen.update((v) => !v)
  }
}
