import { Component, model, output } from '@angular/core'
import { IconComp } from '../../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-practice-stats-bar-comp',
  imports: [IconComp],
  templateUrl: './practice-stats-bar-comp.html',
  styleUrl: './practice-stats-bar-comp.scss'
})
export class PracticeStatsBarComp {
  isOpen = model<boolean>(true)
  edit = output<void>()
  quit = output<void>()

  toggle() {
    this.isOpen.update((o) => !o)
  }
}
