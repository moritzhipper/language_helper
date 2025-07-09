import { Component, computed, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { LearnablesStore } from '../../../store/learnablesStore'
import { LearnablesFilterConfig } from '../../../types_and_schemas/types'
import { filterLearnables } from '../../../utils/learnables-filter'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { RadioComp } from '../../shared/radio-comp/radio-comp'
import { PageWrapperComp } from '../page-wrapper-comp/page-wrapper-comp'
import { LearnableComp } from './learnable-comp/learnable-comp'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.comp.html',
  styleUrl: './overview.comp.scss',
  imports: [
    RadioComp,
    ReactiveFormsModule,
    LearnableComp,
    PageWrapperComp,
    IconComp
  ]
})
export class OverviewComp {
  private readonly _learnablesS = inject(LearnablesStore)
  private _learnables = this._learnablesS.learnables

  private readonly _fb = inject(NonNullableFormBuilder)

  selectedLearnables = signal<string[]>([])
  hasSelected = computed(() => this.selectedLearnables().length > 0)

  hideMoreFilterOnMobile = signal(true)

  form = this._fb.group<LearnablesFilterConfig>({
    type: 'all',
    maxAmountWrongGuesses: 5,
    orderBy: 'created',
    order: 'asc',
    age: 'all',
    partial: ''
  })

  formSignal = toSignal(this.form.valueChanges, {
    initialValue: this.form.value
  })

  filteredLearnables = computed(() => {
    const filter = this.formSignal() as LearnablesFilterConfig
    const learnables = this._learnables()
    if (!filter) return learnables

    return filterLearnables(this._learnables(), filter)
  })

  toggleMoreFilter() {
    this.hideMoreFilterOnMobile.update((v) => !v)
  }

  resetSelection() {
    this.selectedLearnables.set([])
  }

  edit() {}

  delete() {}

  magicAdd() {}

  bulkAdd() {}

  toggleSelection(lId: string) {
    if (this.selectedLearnables().includes(lId)) {
      this.selectedLearnables.update((s) => s.filter((id) => id !== lId))
    } else {
      this.selectedLearnables.update((s) => [...s, lId])
    }
  }

  isSelected(lId: string): boolean {
    return this.selectedLearnables().includes(lId)
  }
}
