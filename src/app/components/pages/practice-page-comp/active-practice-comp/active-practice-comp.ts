import {
  Component,
  computed,
  HostListener,
  inject,
  Signal,
  signal
} from '@angular/core'
import { config } from '../../../../../config'
import { ModalService } from '../../../../services/modal-service'
import { ToastService } from '../../../../services/toast-service'
import { LearnablesStore } from '../../../../store/learnablesStore'
import { LearnableBase } from '../../../../types_and_schemas/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../../../shared/page-wrapper-comp/page-wrapper-comp'

type ActivePracticeSummary = {
  correctGuesses: number
  guessesDone: number
  guessesLeft: number
  progressPercent: number
}

@Component({
  selector: 'app-active-practice-comp',
  imports: [IconComp, PageWrapperComp],
  templateUrl: './active-practice-comp.html',
  styleUrl: './active-practice-comp.scss'
})
export class ActivePracticeComp {
  @HostListener('window:keydown', ['$event']) handleKeyDown(
    event: KeyboardEvent
  ) {
    if (
      this.showStats() &&
      ['ArrowUp', 'ArrowDown', 'ArrowLeft'].includes(event.key)
    ) {
      this.showStats.set(false)
      return
    }
    if (event.key === 'ArrowUp') {
      this.reveal()
    } else if (event.key === 'ArrowLeft' && this.isRevealed()) {
      this.setGuess(false)
      this.showStats.set(false)
    } else if (event.key === 'ArrowRight' && this.isRevealed()) {
      this.setGuess(true)
      this.showStats.set(false)
    }
  }

  private readonly _lStore = inject(LearnablesStore)
  private readonly _toastService = inject(ToastService)
  private readonly _modalS = inject(ModalService)

  isRevealed = signal(false)
  showStats = signal(false)
  currentPractice = this._lStore.currentPractice

  summary: Signal<ActivePracticeSummary> = computed(() => {
    const currentPractice = this.currentPractice()
    if (!currentPractice)
      return {
        correctGuesses: 0,
        guessesDone: 0,
        guessesLeft: 0,
        progressPercent: 0
      }

    const guesses = currentPractice.guesses

    const correctGuesses = guesses.filter((g) => g.isCorrect).length
    const guessesDone = guesses.length

    const cardsAmount = currentPractice.ids.length
    const currentIndex = currentPractice.index
    const guessesLeft = cardsAmount - currentIndex

    const progressPercent = Math.round((currentIndex / cardsAmount) * 100)

    return {
      correctGuesses,
      guessesDone,
      guessesLeft,
      progressPercent
    }
  })

  currentLearnable = computed(() => {
    const currentPractice = this.currentPractice()
    if (!currentPractice) return null
    const learnableId = currentPractice.ids[currentPractice.index]
    return this._lStore.learnables().find((l) => l.id === learnableId)
  })

  reveal() {
    this.isRevealed.set(true)
  }

  toggleStats() {
    this.showStats.update((v) => !v)
  }

  setGuess(isCorrect: boolean) {
    this._toastService.showToast({
      message: this.getRandomExp(isCorrect),
      type: 'guess'
    })
    this.isRevealed.set(false)
    this._lStore.setGuess(isCorrect)
  }

  endPracticeEarly() {
    this._lStore.quitPracticePrematurly()
  }

  async editCard() {
    const currentLearnable = this.currentLearnable()
    if (!currentLearnable) return
    const result = await this._modalS.open<LearnableBase>('single-edit', {
      learnable: currentLearnable
    })

    if (result.type !== 'confirm') return

    const updatedCard = { ...currentLearnable, ...result.value }
    this._lStore.updateLearnables([updatedCard])
    this._toastService.showToast({
      message: 'updated card',
      type: 'info'
    })
  }

  private getRandomExp(isHappy: boolean): string {
    if (isHappy) return this.getRandomElementFromArray(config.happyExpressions)
    return this.getRandomElementFromArray(config.sadExpressions)
  }

  private getRandomElementFromArray(arr: string[]): string {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
  }
}
