import {
  Component,
  computed,
  HostListener,
  inject,
  input,
  signal
} from '@angular/core'
import { config } from '../../../../../config'
import { ModalService } from '../../../../services/modal-service'
import { ToastService } from '../../../../services/toast-service'
import { LearnablesStore } from '../../../../store/learnablesStore'
import { Practice } from '../../../../types_and_schemas/types'
import { PageWrapperComp } from '../../../shared/page-wrapper-comp/page-wrapper-comp'
import { PracticeStatsBarComp } from './practice-stats-bar-comp/practice-stats-bar-comp'

type ActivePracticeSummary = {
  correctGuesses: number
  guessesDone: number
  guessesLeft: number
  progressPercent: number
}

@Component({
  selector: 'app-active-practice-comp',
  imports: [PageWrapperComp, PracticeStatsBarComp],
  templateUrl: './active-practice-comp.html',
  styleUrls: ['./active-practice-comp.scss', './card-animations.scss'],
  host: {
    '[style.--swipe-prog]': 'swipeXDelta()',
    '[style.--swipe-prog-norm]': 'swipeXNormalized()'
  }
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
    } else if (event.key === 'ArrowRight' && this.isRevealed()) {
      this.setGuess(true)
    }
  }

  private readonly _lStore = inject(LearnablesStore)
  private readonly _toastService = inject(ToastService)
  private readonly _modalS = inject(ModalService)

  protected readonly isLastGuessCorrect = signal<boolean>(false)

  private swipeStartX: number = 0
  protected readonly swipeXDelta = signal(0)
  protected readonly swipeXNormalized = signal(0)
  protected readonly isSwiping = signal(false)
  protected readonly swipeVoteThreshold = 200

  isRevealed = signal(false)
  showStats = signal(false)
  currentPractice = input.required<Practice>()

  learnablesInPractice = computed(() => {
    const currentPractice = this.currentPractice()
    if (!currentPractice) return []

    return currentPractice.ids.map(
      (id) => this._lStore.activeBank().learnables.find((l) => l.id === id)!
    )
  })

  cardViewModel = computed(() => {
    const currentIndex = this.currentPractice().index
    const sliceStart = currentIndex === 0 ? 0 : currentIndex - 1
    const sliceEnd = currentIndex + 3

    const classes = {
      'is-swiping': this.isSwiping(),
      'is-revealed': this.isRevealed(),
      'is-correct': this.isLastGuessCorrect()
    }

    return this.learnablesInPractice()
      .map((c, index) => ({
        card: c,
        classes: { ...classes, [`distance-${index - currentIndex}`]: true }
      }))
      .slice(sliceStart, sliceEnd)
  })

  reveal() {
    this.isRevealed.set(true)
    this.showStats.set(false)
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
    this.showStats.set(false)
    this._lStore.setGuess(isCorrect)
    this.isLastGuessCorrect.set(isCorrect)
  }

  endPracticeEarly() {
    this._lStore.quitPracticePrematurly()
  }

  private getRandomExp(isHappy: boolean): string {
    if (isHappy) return this.getRandomElementFromArray(config.happyExpressions)
    return this.getRandomElementFromArray(config.sadExpressions)
  }

  private getRandomElementFromArray(arr: string[]): string {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
  }

  swipeStart(e: TouchEvent) {
    if (!this.isRevealed()) return

    this.isSwiping.set(true)
    this.swipeXDelta.set(0)
    this.swipeStartX = e.touches[0].clientX
  }

  swipeMove(e: TouchEvent) {
    if (!this.isRevealed()) return

    const delta = e.touches[0].clientX - this.swipeStartX
    this.swipeXDelta.set(delta)
    this.swipeXNormalized.set(
      Math.min(1, Math.abs(delta) / this.swipeVoteThreshold)
    )
  }

  swipeEnd(e: TouchEvent) {
    if (!this.isRevealed()) return
    if (this.swipeXDelta() > this.swipeVoteThreshold) {
      this.setGuess(true)
    } else if (this.swipeXDelta() < -this.swipeVoteThreshold) {
      this.setGuess(false)
    }
    this.isSwiping.set(false)
    this.swipeXDelta.set(0)
  }
}
