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

export type FocusCardState = 'editing' | 'revealed' | 'hidden' | 'swiping'

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
    if (this.cardState() === 'hidden' && event.key === 'ArrowUp') {
      this.reveal()
    } else if (this.cardState() === 'revealed') {
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
  protected cardState = signal<FocusCardState>('hidden')
  protected readonly isLastGuessCorrect = signal<boolean>(false)

  private swipeStartX: number = 0
  protected readonly swipeXDelta = signal(0)
  protected readonly swipeXNormalized = signal(0)
  protected readonly swipeVoteThreshold = 200

  currentPractice = input.required<Practice>()

  cardViewModel = computed<CardViewModel[]>(() =>
    getCardsViewModel(
      this.currentPractice(),
      this._lStore.activeBank().learnables
    )
  )

  stateClasses = computed(() => {
    const state = this.cardState()

    return {
      'focus-revealed': state === 'revealed',
      'focus-hidden': state === 'hidden',
      'is-editing': state === 'editing',
      'is-swiping': state === 'swiping',
      'is-finished': this.isFinished(),
      'is-last-correct': this.isLastGuessCorrect(),
      'is-last-wrong': !this.isLastGuessCorrect()
    }
  })

  isFinished = computed<boolean>(() => {
    const practice = this.currentPractice()
    return practice.index > practice.guessables.length - 1
  })

  reveal() {
    if (this.isFinished() || this.cardState() !== 'hidden') return
    this.cardState.set('revealed')
    this.statsOpen.set(false)
  }

  toggleStats() {
    this.statsOpen.update((v) => !v)
  }

  setGuess(guess: Guess) {
    if (this.isFinished()) return
    const guessedRight = guess === 'right'

    this._lStore.setGuess(guess)
    this.isLastGuessCorrect.set(guessedRight)
    this.cardState.set('hidden')
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

  editNote() {
    const focusedState = this.cardState()
    if (focusedState !== 'editing') {
      this.cardState.set('editing')
    } else if (focusedState === 'editing') {
      this.cardState.set('revealed')
      this.statsOpen.set(false)
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
    if (this.cardState() === 'revealed' && !this.isFinished()) {
      this.swipeXDelta.set(0)
      this.cardState.set('swiping')
      this.swipeStartX = e.touches[0].clientX
    }
  }

  swipeMove(e: TouchEvent) {
    if (this.cardState() === 'swiping') {
      const delta = e.touches[0].clientX - this.swipeStartX
      this.swipeXDelta.set(delta)
      this.swipeXNormalized.set(
        Math.min(1, Math.abs(delta) / this.swipeVoteThreshold)
      )
    }
  }

  swipeEnd(e: TouchEvent) {
    const state = this.cardState()
    if (state === 'swiping') {
      if (this.swipeXDelta() > this.swipeVoteThreshold) {
        this.setGuess('right')
      } else if (this.swipeXDelta() < -this.swipeVoteThreshold) {
        this.setGuess('wrong')
      } else {
        this.cardState.set('revealed')
      }
      this.swipeXDelta.set(0)
    }
  }

  updateNotes({ id, newNotes }: { id: string; newNotes: string }) {
    this._lStore.updateLearnables([{ id, notes: newNotes }])
  }

  trackCard(c: CardViewModel) {
    return 'id' in c.content ? c.content.id : 'summary-card'
  }
}
