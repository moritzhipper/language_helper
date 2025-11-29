import { Component, inject } from '@angular/core'
import { LearnablesStore } from '../../../store/learnablesStore'
import { Practice } from '../../../types_and_schemas/types'
import { ActivePracticeComp } from './active-practice-comp/active-practice-comp'
import { ConfigurePracticeComp } from './configure-practice-comp/configure-practice-comp'

@Component({
  selector: 'app-practice',
  imports: [ActivePracticeComp, ConfigurePracticeComp],
  templateUrl: './practice-page-comp.html',
  styleUrl: './practice-page-comp.scss'
})
export class PracticeComp {
  protected readonly currentPractice = inject(LearnablesStore).currentPractice

  protected isFinished(prac: Practice): boolean {
    return prac.index >= prac.guessables.length
  }

  protected isUnfinished(prac: Practice): boolean {
    return prac.index < prac.guessables.length
  }
}
