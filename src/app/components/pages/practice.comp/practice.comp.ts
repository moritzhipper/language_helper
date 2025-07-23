import {
  Component,
  computed,
  HostListener,
  inject,
  signal
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { ToastService } from '../../../services/toast-service'
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

  private readonly _toastService = inject(ToastService)
  private readonly sStore = inject(SettingsStore)
  learningLang = this.sStore.learningLang
  speakingLang = this.sStore.speakingLang

  private readonly _fb = inject(NonNullableFormBuilder)
  form = this._fb.group({
    type: 'all',
    collection: 'all',
    confidence: 'low',
    reverseDirection: false
  })
  private readonly _formSignal = toSignal(this.form.valueChanges, {
    initialValue: this.form.value
  })

  private readonly learnablesS = inject(LearnablesStore)
  collections = this.learnablesS.collections

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

    const allLearnableIDsFiltered = filterLearnables(
      this.learnablesS.learnables(),
      filter
    ).map((l) => l.id)

    const selectedCollection = this.collections().find(
      (c) => c.id === formValue.collection
    )

    if (selectedCollection) {
      return allLearnableIDsFiltered.filter((id) =>
        selectedCollection.learnableIDs.includes(id)
      )
    }
    return allLearnableIDsFiltered
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
    this._toastService.showToast({
      message: isCorrect ? '😊' : '😿',
      type: 'guess'
    })
    this.isRevealed.set(false)
    this.learnablesS.setGuess(isCorrect)
  }

  endPracticeEarly() {
    this.learnablesS.quitPracticePrematurly()
    this._resetPageState()
  }

  endPractice() {
    this.learnablesS.quitPractice()
    this._resetPageState()
  }

  private _resetPageState() {
    this.form.reset()
    this.showStats.set(false)
    this.isRevealed.set(false)
  }

  start() {
    const reverseDirection = !!this._formSignal().reverseDirection
    this.learnablesS.startPractice(this.selectedCardsIds(), reverseDirection)
  }
}
