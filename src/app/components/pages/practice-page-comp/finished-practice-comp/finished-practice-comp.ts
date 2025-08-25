import { Component, computed, inject } from '@angular/core'
import { LearnablesStore } from '../../../../store/learnablesStore'
import { PageWrapperComp } from '../../../shared/page-wrapper-comp/page-wrapper-comp'

@Component({
  selector: 'app-finished-practice-comp',
  imports: [PageWrapperComp],
  templateUrl: './finished-practice-comp.html',
  styleUrl: './finished-practice-comp.scss'
})
export class FinishedPracticeComp {
  private readonly _lStore = inject(LearnablesStore)
  currentPractice = this._lStore.currentPractice

  practiceSummary = computed(() => {
    const currentPractice = this.currentPractice()
    if (!currentPractice)
      return {
        cardsAmountTotal: 0,
        correctAmountTotal: 0,
        correctAmountPercent: 0,
        progressPercent: 0,
        currentIndex: 0,
        guessesTotal: 0,
        cardsLeft: 0
      }

    const guesses = currentPractice.guesses

    const guessesTotal = guesses.length
    const cardsAmountTotal = currentPractice.ids.length
    const correctAmountTotal = guesses.filter((g) => g.isCorrect).length
    const correctAmountPercent = Math.round(
      (correctAmountTotal / guessesTotal) * 100
    )
    const progressPercent = Math.round(
      (currentPractice.index / cardsAmountTotal) * 100
    )
    const currentIndex = currentPractice.index
    const cardsLeft = cardsAmountTotal - currentIndex

    return {
      guessesTotal,
      cardsAmountTotal,
      correctAmountTotal,
      correctAmountPercent,
      progressPercent,
      currentIndex,
      cardsLeft
    }
  })

  endPractice() {
    this._lStore.quitPractice()
  }
}
