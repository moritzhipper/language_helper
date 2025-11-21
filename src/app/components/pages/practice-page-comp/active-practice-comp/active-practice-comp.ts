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
import { Guess, Practice } from '../../../../types_and_schemas/types'
import { PageWrapperComp } from '../../../shared/page-wrapper-comp/page-wrapper-comp'
import { PracticeCardComp } from './practice-card-comp/practice-card-comp'
import { CardViewModel, getCardsViewModel } from './practice-helpers'
import { PracticeStatsBarComp } from './practice-stats-bar-comp/practice-stats-bar-comp'
import { PracticeSummaryCard } from './practice-summary-card/practice-summary-card'

export type FocusCardState = 'editing' | 'revealed' | 'hidden'

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
    if (this.focusedCardState() === 'hidden' && event.key === 'ArrowUp') {
      this.reveal()
    } else if (this.focusedCardState() === 'revealed') {
      if (event.key === 'ArrowLeft') {
        this.setGuess('wrong')
      } else if (event.key === 'ArrowRight') {
        this.setGuess('right')
      }
    }
  }

  private readonly _lStore = inject(LearnablesStore)
  private readonly _toastService = inject(ToastService)
  private readonly _modalS = inject(ModalService)

  protected readonly statsOpen = signal<boolean>(false)
  protected focusedCardState = signal<FocusCardState>('hidden')
  protected readonly isLastGuessCorrect = signal<boolean>(false)

  private swipeStartX: number = 0
  protected readonly swipeXDelta = signal(0)
  protected readonly swipeXNormalized = signal(0)
  protected readonly isSwiping = signal(false)
  protected readonly swipeVoteThreshold = 200

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
    this.focusedCardState.set('revealed')
  }

  toggleStats() {
    this.statsOpen.update((v) => !v)
  }

  setGuess(guess: Guess) {
    if (this.isFinished()) return
    const guessedRight = guess === 'right'

    this._lStore.setGuess(guess)
    this.isLastGuessCorrect.set(guessedRight)
    this.focusedCardState.set('hidden')
    this.statsOpen.set(false)

    this._toastService.showToast({
      message: this.getRandomExp(guessedRight),
      type: 'guess'
    })
  }

  quit() {
    if (!this.isFinished()) {
      this._lStore.quitPracticePrematurly()
    } else {
      this._lStore.quitPractice()
    }
  }

  getCardClasses(viewIndex: number) {
    return {
      'is-revealed': this.focusedCardState() === 'revealed',
      'is-correct': this.isLastGuessCorrect(),
      'is-swiping': this.isSwiping(),
      'is-editing': this.focusedCardState() === 'editing',
      ['index-' + viewIndex]: true
    }
  }

  editNote() {
    const focusedState = this.focusedCardState()
    if (focusedState !== 'editing') {
      this.focusedCardState.set('editing')
    } else if (focusedState === 'editing') {
      this.focusedCardState.set('revealed')
    }
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
    if (this.focusedCardState() === 'revealed' && !this.isFinished()) {
      this.isSwiping.set(true)
      this.swipeXDelta.set(0)
      this.swipeStartX = e.touches[0].clientX
    }
  }

  swipeMove(e: TouchEvent) {
    if (this.focusedCardState() === 'revealed' && !this.isFinished()) {
      const delta = e.touches[0].clientX - this.swipeStartX
      this.swipeXDelta.set(delta)
      this.swipeXNormalized.set(
        Math.min(1, Math.abs(delta) / this.swipeVoteThreshold)
      )
    }
  }

  swipeEnd(e: TouchEvent) {
    if (this.focusedCardState() === 'revealed' && !this.isFinished()) {
      if (this.swipeXDelta() > this.swipeVoteThreshold) {
        this.setGuess('right')
      } else if (this.swipeXDelta() < -this.swipeVoteThreshold) {
        this.setGuess('wrong')
      }
      this.isSwiping.set(false)
      this.swipeXDelta.set(0)
    }
  }

  trackCard(c: CardViewModel) {
    return 'id' in c.content ? c.content.id : 'summary-card'
  }
}
