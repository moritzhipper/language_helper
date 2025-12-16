import {
  Component,
  computed,
  HostListener,
  inject,
  input,
  signal
} from '@angular/core'
import { config } from '../../../../../config'
import { LearnablesStore } from '../../../../store/learnablesStore'
import { Guess, Practice } from '../../../../types_and_schemas/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { PracticeCardComp } from './practice-card-comp/practice-card-comp'
import { CardViewModel, getCardsViewModel } from './practice-helpers'
import { PracticeStatsBarComp } from './practice-stats-bar-comp/practice-stats-bar-comp'
import { PracticeSummaryCard } from './practice-summary-card/practice-summary-card'
import { getSwipeProgress, SwipeProgress } from './swipe-prog-helpers'

export type FocusCardState = 'editing' | 'revealed' | 'hidden' | 'swiping'

@Component({
  selector: 'app-active-practice-comp',
  imports: [
    PracticeStatsBarComp,
    PracticeCardComp,
    PracticeSummaryCard,
    IconComp
  ],
  templateUrl: './active-practice-comp.html',
  styleUrls: ['./active-practice-comp.scss', './card-animations.scss'],
  host: {
    '[style.--swipe-prog]': 'swipeProg().xDelta',
    '[style.--swipe-x-norm]': 'swipeProg().xNorm',
    '[class]': 'stateClasses()'
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

  protected readonly statsOpen = signal<boolean>(false)
  protected readonly cardState = signal<FocusCardState>('hidden')
  protected readonly lastGuessOutcome = signal<Guess>('unanswered')

  private swipeStartX: number = 0
  protected readonly swipeProg = signal<SwipeProgress>({
    xDelta: 0,
    xNorm: 0,
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
      'is-last-correct': this.lastGuessOutcome() === 'right',
      'is-last-wrong': this.lastGuessOutcome() === 'wrong'
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

  setGuess(guess: Guess) {
    if (this.isFinished()) return

    this._lStore.setGuess(guess)
    this.lastGuessOutcome.set(guess)
    this.cardState.set('hidden')
    this.statsOpen.set(false)
  }

  quit() {
    if (this.isFinished()) {
      this._lStore.quitPractice()
    } else {
      this.lastGuessOutcome.set('wrong')
      this._lStore.quitPracticePrematurly()
    }
  }

  editNote() {
    const focusedState = this.cardState()
    if (focusedState !== 'editing') {
      this.cardState.set('editing')
    } else if (focusedState === 'editing') {
      this.cardState.set('revealed')
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
    if (this.cardState() !== 'revealed' || this.isFinished()) return

    this.setSwipeProg(0)
    this.swipeStartX = e.clientX
    this.cardState.set('swiping')
  }

  pointerMove(e: PointerEvent) {
    if (this.cardState() !== 'swiping') return
    this.setSwipeProg(e.clientX - this.swipeStartX)
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
