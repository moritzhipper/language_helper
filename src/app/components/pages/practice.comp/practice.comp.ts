import {
  Component,
  computed,
  HostListener,
  inject,
  signal
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { LearnablesStore } from '../../../store/learnablesStore'
import { SettingsStore } from '../../../store/settingsStore'
import { LearnablesFilterConfig } from '../../../types_and_schemas/types'
import { filterLearnables } from '../../../utils/learnables-filter'
import { CounterComp } from '../../shared/counter-comp/counter-comp'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { RadioComp } from '../../shared/radio-comp/radio-comp'
import { PageWrapperComp } from '../page-wrapper-comp/page-wrapper-comp'

@Component({
  selector: 'app-practice',
  imports: [
    RadioComp,
    ReactiveFormsModule,
    PageWrapperComp,
    CounterComp,
    IconComp
  ],
  templateUrl: './practice.comp.html',
  styleUrl: './practice.comp.scss'
})
export class PracticeComp {
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

  private readonly sStore = inject(SettingsStore)
  learningLang = this.sStore.learningLang
  speakingLang = this.sStore.speakingLang

  private readonly _fb = inject(NonNullableFormBuilder)
  form = this._fb.group({
    type: 'all',
    confidence: 'low',
    reverseDirection: false
  })
  private readonly _formSignal = toSignal(this.form.valueChanges, {
    initialValue: this.form.value
  })

  private readonly learnablesS = inject(LearnablesStore)

  isRevealed = signal(false)
  showStats = signal(false)
  currentPractice = this.learnablesS.currentPractice

  // this summary is only used to display info to the user
  // and not for further calculations
  practiceSummary = computed(() => {
    const currentPractice = this.currentPractice()
    if (!currentPractice)
      return {
        cardsAmountTotal: 0,
        correctAmountTotal: 0,
        correctAmountPercent: 0,
        progressPercent: 0,
        currentIndex: 0,
        guessesTotal: 0
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

    return {
      guessesTotal,
      cardsAmountTotal,
      correctAmountTotal,
      correctAmountPercent,
      progressPercent,
      currentIndex
    }
  })

  selectedCardsIds = computed(() => {
    const formValue = this._formSignal()

    const filter = {
      type: formValue.type,
      confidence: formValue.confidence
    } as LearnablesFilterConfig
    if (!filter) return []

    const learnables = this.learnablesS.learnables()
    return filterLearnables(learnables, filter).map((l) => l.id)
  })

  hasFinishedPractice = computed(() => {
    const currentPractice = this.currentPractice()
    return (
      currentPractice && currentPractice.index === currentPractice.ids.length
    )
  })

  currentLearnable = computed(() => {
    const currentPractice = this.currentPractice()
    if (!currentPractice) return null
    const learnableId = currentPractice.ids[currentPractice.index]
    return this.learnablesS.learnables().find((l) => l.id === learnableId)
  })

  showStatsToggle() {
    this.showStats.update((prev) => !prev)
  }

  reveal() {
    this.isRevealed.set(true)
  }

  setGuess(isCorrect: boolean) {
    this.isRevealed.set(false)
    this.learnablesS.setGuess(isCorrect)
  }

  endPractice() {
    this.learnablesS.endPractice()
    this.form.reset()
    this.showStats.set(false)
  }

  start() {
    const reverseDirection = !!this._formSignal().reverseDirection
    this.learnablesS.startPractice(this.selectedCardsIds(), reverseDirection)
  }
}
