import { Component, computed, inject, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { SettingsStore } from '../../../store/settingsStore'
import {
  LearnableBase,
  LearnablesFilterConfig
} from '../../../types_and_schemas/types'
import { calculateAverageConfidencePercent } from '../../../utils/genaral-utils'
import { filterLearnables } from '../../../utils/learnables-filter'
import { ActivePracticeComp } from './active-practice-comp/active-practice-comp'
import { ConfigurePracticeComp } from './configure-practice-comp/configure-practice-comp'
import { FinishedPracticeComp } from './finished-practice-comp/finished-practice-comp'

@Component({
  selector: 'app-practice',
  imports: [
    ReactiveFormsModule,

    FinishedPracticeComp,
    ActivePracticeComp,
    ConfigurePracticeComp
  ],
  templateUrl: './practice-page-comp.html',
  styleUrl: './practice-page-comp.scss'
})
export class PracticeComp {
  private readonly _toastService = inject(ToastService)
  private readonly sStore = inject(SettingsStore)
  private readonly _modalS = inject(ModalService)
  learningLang = this.sStore.learningLang
  speakingLang = this.sStore.speakingLang

  private readonly _lStore = inject(LearnablesStore)
  collections = this._lStore.collections
  pseudoCollections = this._lStore.pseudoCollections

  isRevealed = signal(false)
  showStats = signal(false)
  currentPractice = this._lStore.currentPractice

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
        guessesTotal: 0,
        cardsLeft: 0
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
    const cardsLeft = cardsAmountTotal - currentIndex

    return {
      guessesTotal,
      cardsAmountTotal,
      correctAmountTotal,
      correctAmountPercent,
      progressPercent,
      currentIndex,
      cardsLeft
    }
  })

  selectedCardsIds = computed(() => {
    const formValue = this._formSignal()

    const filter = {
      type: formValue.type,
      confidence: formValue.confidence
    } as LearnablesFilterConfig

    const allLearnableIDsFiltered = filterLearnables(
      this._lStore.learnables(),
      filter
    ).map((l) => l.id)

    const selectedCollection = this.collections().find(
      (c) => c.id === formValue.collectionIdentifier
    )

    const selectedPseudoCollection = this.pseudoCollections().find(
      (c) => c.name === formValue.collectionIdentifier
    )

    if (selectedCollection) {
      return allLearnableIDsFiltered.filter((id) =>
        selectedCollection.learnableIDs.includes(id)
      )
    }

    if (selectedPseudoCollection) {
      return allLearnableIDsFiltered.filter((id) =>
        selectedPseudoCollection.learnableIDs.includes(id)
      )
    }

    return allLearnableIDsFiltered
  })

  hasNoPractice = computed(() => this.currentPractice())

  hasFinishedPractice = computed(() => {
    const currentPractice = this.currentPractice()
    return (
      currentPractice && currentPractice.index === currentPractice.ids.length
    )
  })
  hasUnfinishedPractice = computed(() => {
    const currentPractice = this.currentPractice()
    return currentPractice && currentPractice.index < currentPractice.ids.length
  })

  currentLearnable = computed(() => {
    const currentPractice = this.currentPractice()
    if (!currentPractice) return null
    const learnableId = currentPractice.ids[currentPractice.index]
    return this._lStore.learnables().find((l) => l.id === learnableId)
  })

  showStatsToggle() {
    this.showStats.update((prev) => !prev)
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
    this._resetPageState()
  }

  endPractice() {
    this._lStore.quitPractice()
    this._resetPageState()
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

  private _resetPageState() {
    this.form.reset()
    this.showStats.set(false)
    this.isRevealed.set(false)
  }

  start() {
    const reverseDirection = !!this._formSignal().reverseDirection
    this._lStore.startPractice(this.selectedCardsIds(), reverseDirection)
  }

  calculateAverageConfidence(learnableIds: string[]): number {
    const learnables = this._lStore
      .learnables()
      .filter((l) => learnableIds.includes(l.id))

    const percent = calculateAverageConfidencePercent(learnables)
    return percent
  }
}
