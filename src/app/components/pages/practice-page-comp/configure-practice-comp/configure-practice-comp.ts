import { Component, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { LearnablesStore } from '../../../../store/learnablesStore'
import { SettingsStore } from '../../../../store/settingsStore'
import { LearnablesFilterConfig } from '../../../../types_and_schemas/types'
import { calculateAverageConfidencePercent } from '../../../../utils/genaral-utils'
import { filterLearnables } from '../../../../utils/learnables-filter'
import { CounterComp } from '../../../shared/counter-comp/counter-comp'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../../../shared/page-wrapper-comp/page-wrapper-comp'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'

@Component({
  selector: 'app-configure-practice-comp',
  imports: [
    PageWrapperComp,
    CounterComp,
    RadioComp,
    ReactiveFormsModule,
    IconComp
  ],
  templateUrl: './configure-practice-comp.html',
  styleUrl: './configure-practice-comp.scss'
})
export class ConfigurePracticeComp {
  private readonly _fb = inject(NonNullableFormBuilder)
  private readonly _lStore = inject(LearnablesStore)
  private readonly sStore = inject(SettingsStore)
  learningLang = this.sStore.learningLang
  speakingLang = this.sStore.speakingLang
  collections = this._lStore.collections
  pseudoCollections = this._lStore.pseudoCollections

  form = this._fb.group({
    type: null,
    collectionIdentifier: 'All',
    confidence: undefined,
    reverseDirection: false
  })

  private readonly _formSignal = toSignal(this.form.valueChanges, {
    initialValue: this.form.value
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
