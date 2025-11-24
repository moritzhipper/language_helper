import {
  Component,
  computed,
  HostListener,
  inject,
  input,
  signal
} from '@angular/core'
import { config } from '../../../../../config'
import { ToastService } from '../../../../services/toast-service'
import { LearnablesStore } from '../../../../store/learnablesStore'
import { Guess, Practice } from '../../../../types_and_schemas/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../../../shared/page-wrapper-comp/page-wrapper-comp'
import { PracticeCardComp } from './practice-card-comp/practice-card-comp'
import { CardViewModel, getCardsViewModel } from './practice-helpers'
import { PracticeStatsBarComp } from './practice-stats-bar-comp/practice-stats-bar-comp'
import { PracticeSummaryCard } from './practice-summary-card/practice-summary-card'
import { getSwipeProgress, SwipeProgress } from './swipe-prog-helpers'

export type FocusCardState = 'editing' | 'revealed' | 'hidden' | 'swiping'

@Component({
  selector: 'app-active-practice-comp',
  imports: [
    PageWrapperComp,
    PracticeStatsBarComp,
    PracticeCardComp,
    PracticeSummaryCard,
    IconComp
  ],
  templateUrl: './active-practice-comp.html',
  styleUrls: ['./active-practice-comp.scss', './card-animations.scss'],
  host: {
    '[style.--swipe-prog]': 'swipeProg().xDelta',
    '[style.--swipe-x-norm-right]': 'swipeProg().xRNorm',
    '[style.--swipe-x-norm-left]': 'swipeProg().xLNorm'
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

  protected readonly statsOpen = signal<boolean>(false)
  protected readonly cardState = signal<FocusCardState>('hidden')
  protected readonly isLastGuessCorrect = signal<boolean>(false)

  private swipeStartX: number = 0
  protected readonly swipeProg = signal<SwipeProgress>({
    xDelta: 0,
    xRNorm: 0,
    xLNorm: 0,
    guessRight: false,
    guessWrong: false
  })

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
    if (this.isFinished()) {
      this._lStore.quitPractice()
    } else {
      this._lStore.quitPracticePrematurly()
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

  pointerDown(e: PointerEvent) {
    if (this.cardState() === 'revealed' && !this.isFinished()) {
      this.setSwipeProg(0)
      this.swipeStartX = e.clientX
      this.cardState.set('swiping')
    }
  }

  pointerMove(e: PointerEvent) {
    if (this.cardState() === 'swiping') {
      this.setSwipeProg(e.clientX - this.swipeStartX)
    }
  }

  pointerUp() {
    if (this.cardState() === 'swiping') {
      const { guessRight, guessWrong } = this.swipeProg()
      if (guessRight) {
        this.setGuess('right')
      } else if (guessWrong) {
        this.setGuess('wrong')
      } else {
        this.cardState.set('revealed')
      }
      this.setSwipeProg(0)
    } else if (this.cardState() === 'hidden') {
      this.cardState.set('revealed')
    }
  }

  updateNotes({ id, newNotes }: { id: string; newNotes: string }) {
    this._lStore.updateLearnables([{ id, notes: newNotes }])
  }

  trackCard(c: CardViewModel) {
    return 'id' in c.content ? c.content.id : 'summary-card'
  }

  setSwipeProg(xDelta: number) {
    this.swipeProg.set(getSwipeProgress(xDelta))
  }
}
