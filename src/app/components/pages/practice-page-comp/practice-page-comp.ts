import { Component, computed, inject } from '@angular/core'
import { LearnablesStore } from '../../../store/learnablesStore'
import { ActivePracticeComp } from './active-practice-comp/active-practice-comp'
import { ConfigurePracticeComp } from './configure-practice-comp/configure-practice-comp'
import { FinishedPracticeComp } from './finished-practice-comp/finished-practice-comp'

@Component({
  selector: 'app-practice',
  imports: [FinishedPracticeComp, ActivePracticeComp, ConfigurePracticeComp],
  templateUrl: './practice-page-comp.html',
  styleUrl: './practice-page-comp.scss'
})
export class PracticeComp {
  private readonly currentPractice = inject(LearnablesStore).currentPractice

  hasFinishedPractice = computed(() => {
    const curP = this.currentPractice()
    return curP && curP.index === curP.ids.length
  })
  hasUnfinishedPractice = computed(() => {
    const curP = this.currentPractice()
    return curP && curP.index < curP.ids.length
  })
}
