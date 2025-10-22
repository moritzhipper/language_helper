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
  protected learningLang = this.sStore.learningLang
  protected speakingLang = this.sStore.speakingLang
  protected collections = this._lStore.collections
  protected learnables = this._lStore.learnables

  protected form = this._fb.group({
    type: null,
    collectionIdentifier: 'All Cards',
    confidence: undefined,
    reverseDirection: false
  })

  private readonly _formSignal = toSignal(this.form.valueChanges, {
    initialValue: this.form.value
  })

  protected readonly selectedLearnableIds = computed(() => {
    const formValue = this._formSignal()

    const filter = {
      type: formValue.type,
      confidence: formValue.confidence
    } as LearnablesFilterConfig

    const allLearnableIDsFiltered = filterLearnables(
      this.learnables(),
      filter
    ).map((l) => l.id)

    const selectedCollection = this.collections().find(
      (c) => c.id === formValue.collectionIdentifier
    )

    if (selectedCollection) {
      return allLearnableIDsFiltered.filter((id) =>
        selectedCollection.learnableIDs.includes(id)
      )
    }

    return allLearnableIDsFiltered
  })

  start() {
    const reverseDirection = !!this.form.value.reverseDirection
    this._lStore.startPractice(this.selectedLearnableIds(), reverseDirection)
  }

  calculateAverageConfidence(learnableIds: string[]): number {
    const learnables = this._lStore
      .learnables()
      .filter((l) => learnableIds.includes(l.id))

    return calculateAverageConfidencePercent(learnables)
  }
}
