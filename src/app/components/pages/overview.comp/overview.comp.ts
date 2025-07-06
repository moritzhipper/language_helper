import { Component, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { LearnablesStore } from '../../../store/learnablesStore'
import { LearnablesFilterConfig } from '../../../types_and_schemas/types'
import { filterLearnables } from '../../../utils'
import { RadioComp } from '../../shared/radio-comp/radio-comp'
import { PageWrapperComp } from '../page-wrapper-comp/page-wrapper-comp'
import { LearnableComp } from './learnable-comp/learnable-comp'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.comp.html',
  styleUrl: './overview.comp.scss',
  imports: [RadioComp, ReactiveFormsModule, LearnableComp, PageWrapperComp]
})
export class OverviewComp {
  private readonly _learnablesS = inject(LearnablesStore)
  private _learnables = this._learnablesS.learnables

  private readonly _fb = inject(NonNullableFormBuilder)

  form = this._fb.group<LearnablesFilterConfig>({
    type: 'all',
    minAmountTrueGuesses: 0,
    orderBy: 'created',
    order: 'asc'
  })

  formSignal = toSignal(this.form.valueChanges)

  filteredLearnables = computed(() => {
    const filter = this.formSignal() as LearnablesFilterConfig
    const learnables = this._learnables()
    if (!filter) return learnables

    return filterLearnables(this._learnables(), filter)
  })
}
