import {
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
  untracked
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { LearnablesFilterConfig } from '../../../../types_and_schemas/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'

export type LearnablesFilterFormType = Omit<LearnablesFilterConfig, 'ids'> & {
  added: 'last' | 'all'
}

@Component({
  selector: 'app-filter-form-comp',
  imports: [IconComp, RadioComp, ReactiveFormsModule],
  templateUrl: './filter-form-comp.html',
  styleUrl: './filter-form-comp.scss'
})
export class FilterFormComp {
  private readonly _fb = inject(NonNullableFormBuilder)

  showFilter = signal(false)
  filter = output<LearnablesFilterFormType>()

  private initialValue: LearnablesFilterFormType = {
    type: 'all',
    confidence: 'all',
    orderBy: 'created',
    added: 'all',
    age: 'all',
    order: 'asc',
    search: ''
  }

  form = this._fb.group<LearnablesFilterFormType>(this.initialValue)

  formSignal = toSignal(this.form.valueChanges, {
    initialValue: this.initialValue
  })

  isInitialValue = computed(() => {
    const currentValue = this.formSignal()
    return JSON.stringify(currentValue) === JSON.stringify(this.initialValue)
  })

  constructor() {
    effect(() => {
      const filter = this.formSignal() as LearnablesFilterFormType
      untracked(() => {
        this.filter.emit(filter)
      })
    })
  }

  toggleExpanded() {
    this.showFilter.update((v) => !v)
  }
}
