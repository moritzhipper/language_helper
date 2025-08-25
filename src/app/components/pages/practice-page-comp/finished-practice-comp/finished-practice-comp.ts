import { Component, computed, inject, Signal } from '@angular/core'
import { LearnablesStore } from '../../../../store/learnablesStore'
import { PageWrapperComp } from '../../../shared/page-wrapper-comp/page-wrapper-comp'

type FinishedSummary = {
  correctAmount: number
  cardsAmount: number
}

@Component({
  selector: 'app-finished-practice-comp',
  imports: [PageWrapperComp],
  templateUrl: './finished-practice-comp.html',
  styleUrl: './finished-practice-comp.scss'
})
export class FinishedPracticeComp {
  private readonly _lStore = inject(LearnablesStore)
  currentPractice = this._lStore.currentPractice

  summary: Signal<FinishedSummary> = computed(() => {
    const currentPractice = this.currentPractice()
    if (!currentPractice) {
      return {
        correctAmount: 0,
        cardsAmount: 0
      }
    }
    const correctAmount = currentPractice.guesses.filter(
      (g) => g.isCorrect
    ).length
    return {
      correctAmount,
      cardsAmount: currentPractice.ids.length
    }
  })

  endPractice() {
    this._lStore.quitPractice()
  }
}
