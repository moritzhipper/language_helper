import { Component, inject } from '@angular/core'
import { LearnablesStore } from '../../../store/learnablesStore'
import { Practice } from '../../../types_and_schemas/types'
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
  protected readonly currentPractice = inject(LearnablesStore).currentPractice

  protected isFinished(prac: Practice): boolean {
    return prac.index >= prac.ids.length
  }

  protected isUnfinished(prac: Practice): boolean {
    return prac.index < prac.ids.length
  }
}
