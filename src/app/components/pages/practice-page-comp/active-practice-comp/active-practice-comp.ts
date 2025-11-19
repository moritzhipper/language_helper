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
import { PracticeCardComp } from './practice-card-comp/practice-card-comp'
import { CardViewModel, getCardsViewModel } from './practice-helpers'
import { PracticeStatsBarComp } from './practice-stats-bar-comp/practice-stats-bar-comp'
import { PracticeSummaryCard } from './practice-summary-card/practice-summary-card'

@Component({
  selector: 'app-active-practice-comp',
  imports: [
    PageWrapperComp,
    PracticeStatsBarComp,
    PracticeCardComp,
    PracticeSummaryCard
  ],
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
  isEditing = signal(false)
  showStats = signal(false)
  currentPractice = input.required<Practice>()

  cardViewModel = computed<CardViewModel[]>(() =>
    getCardsViewModel(
      this.currentPractice(),
      this._lStore.activeBank().learnables
    )
  )

  isFinished = computed<boolean>(() => {
    const practice = this.currentPractice()
    return practice.index > practice.guessables.length - 1
  })

  reveal() {
    if (this.isFinished()) return
    this.isRevealed.set(true)
    this.showStats.set(false)
  }

  toggleStats() {
    this.showStats.update((v) => !v)
  }

  setGuess(isCorrect: boolean) {
    if (this.isFinished()) return
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

  getCardClasses(viewIndex: number) {
    return {
      'is-revealed': this.isRevealed(),
      'is-correct': this.isLastGuessCorrect(),
      'is-swiping': this.isSwiping(),
      ['index-' + viewIndex]: true
    }
  }

  editNote() {
    this.isEditing.set(true)
  }

  removePractice() {
    this._lStore.quitPractice()
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
    if (!this.isRevealed() || this.isFinished()) return

    this.isSwiping.set(true)
    this.swipeXDelta.set(0)
    this.swipeStartX = e.touches[0].clientX
  }

  swipeMove(e: TouchEvent) {
    if (!this.isRevealed() || this.isFinished()) return

    const delta = e.touches[0].clientX - this.swipeStartX
    this.swipeXDelta.set(delta)
    this.swipeXNormalized.set(
      Math.min(1, Math.abs(delta) / this.swipeVoteThreshold)
    )
  }

  swipeEnd(e: TouchEvent) {
    if (!this.isRevealed() || this.isFinished()) return
    if (this.swipeXDelta() > this.swipeVoteThreshold) {
      this.setGuess(true)
    } else if (this.swipeXDelta() < -this.swipeVoteThreshold) {
      this.setGuess(false)
    }
    this.isSwiping.set(false)
    this.swipeXDelta.set(0)
  }

  trackCard(c: CardViewModel) {
    return 'id' in c.content ? c.content.id : 'summary-card'
  }
}
