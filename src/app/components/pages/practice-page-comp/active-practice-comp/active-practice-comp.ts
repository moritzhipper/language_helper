import {
  Component,
  computed,
  HostListener,
  inject,
  input,
  Signal,
  signal
} from '@angular/core'
import { config } from '../../../../../config'
import { ModalService } from '../../../../services/modal-service'
import { ToastService } from '../../../../services/toast-service'
import { LearnablesStore } from '../../../../store/learnablesStore'
import { Practice } from '../../../../types_and_schemas/types'
import { PageWrapperComp } from '../../../shared/page-wrapper-comp/page-wrapper-comp'

type ActivePracticeSummary = {
  correctGuesses: number
  guessesDone: number
  guessesLeft: number
  progressPercent: number
}

@Component({
  selector: 'app-active-practice-comp',
  imports: [PageWrapperComp],
  templateUrl: './active-practice-comp.html',
  styleUrl: './active-practice-comp.scss',
  host: {
    '[style.--swipe-prog]': 'swipeXDelta()',
    '[style.--swipe-max]': 'swipeVoteThreshold'
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
      this.showStats.set(false)
    } else if (event.key === 'ArrowRight' && this.isRevealed()) {
      this.setGuess(true)
      this.showStats.set(false)
    }
  }

  private readonly _lStore = inject(LearnablesStore)
  private readonly _toastService = inject(ToastService)
  private readonly _modalS = inject(ModalService)

  protected readonly isLastGuessCorrect = signal<boolean>(false)

  private swipeStartX: number = 0
  protected readonly swipeXDelta = signal(0)
  protected readonly isSwiping = signal(false)
  protected readonly swipeVoteThreshold = 200

  isRevealed = signal(false)
  showStats = signal(false)
  currentPractice = input.required<Practice>()

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

  learnablesInPractice = computed(() => {
    const currentPractice = this.currentPractice()
    if (!currentPractice) return []

    return currentPractice.ids.map(
      (id) => this._lStore.activeBank().learnables.find((l) => l.id === id)!
    )
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
    this.isLastGuessCorrect.set(isCorrect)
  }

  endPracticeEarly() {
    this._lStore.quitPracticePrematurly()
  }

  // async editCard() {
  //   const currentLearnable = this.currentLearnable()
  //   if (!currentLearnable) return
  //   const result = await this._modalS.open<LearnableBase>('single-edit', {
  //     learnable: currentLearnable
  //   })

  //   if (result.type !== 'confirm') return

  //   const updatedCard = { ...currentLearnable, ...result.value }
  //   this._lStore.updateLearnables([updatedCard])
  //   this._toastService.showToast({
  //     message: 'updated card',
  //     type: 'info'
  //   })
  // }

  private getRandomExp(isHappy: boolean): string {
    if (isHappy) return this.getRandomElementFromArray(config.happyExpressions)
    return this.getRandomElementFromArray(config.sadExpressions)
  }

  private getRandomElementFromArray(arr: string[]): string {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
  }

  swipeStart(e: TouchEvent) {
    e.preventDefault()
    if (!this.isRevealed()) return

    this.isSwiping.set(true)
    this.swipeXDelta.set(0)
    this.swipeStartX = e.touches[0].clientX
  }

  swipeMove(e: TouchEvent) {
    e.preventDefault()
    if (!this.isRevealed()) return

    this.swipeXDelta.set(e.touches[0].clientX - this.swipeStartX)
  }

  swipeEnd(e: TouchEvent) {
    e.preventDefault()
    if (!this.isRevealed()) return
    if (this.swipeXDelta() > this.swipeVoteThreshold) {
      this.setGuess(true)
    } else if (this.swipeXDelta() < -this.swipeVoteThreshold) {
      this.setGuess(false)
    }
    this.isSwiping.set(false)
    this.swipeXDelta.set(0)
  }

  protected isCardVisible(currentIndex: number, cardIndex: number): boolean {
    const distance = this.cardDistance(currentIndex, cardIndex)
    return distance <= 2 && distance >= -1
  }

  protected cardDistance(currentIndex: number, cardIndex: number): number {
    return cardIndex - currentIndex
  }

  protected isCardCurrent(currentIndex: number, cardIndex: number): boolean {
    return currentIndex === cardIndex
  }

  protected isCardNext(currentIndex: number, cardIndex: number): boolean {
    return currentIndex + 1 === cardIndex
  }

  protected isCardOverNext(currentIndex: number, cardIndex: number): boolean {
    return currentIndex + 2 === cardIndex
  }
}
