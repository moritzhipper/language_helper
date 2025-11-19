import { Component, input, model, output } from '@angular/core'
import { IconComp } from '../../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-practice-stats-bar-comp',
  imports: [IconComp],
  templateUrl: './practice-stats-bar-comp.html',
  styleUrl: './practice-stats-bar-comp.scss'
})
export class PracticeStatsBarComp {
  isOpen = model<boolean>(true)
  isFinished = input<boolean>(false)
  edit = output<void>()
  quitEarly = output<void>()
  finalize = output<void>()

  toggle() {
    this.isOpen.update((o) => !o)
  }
}
