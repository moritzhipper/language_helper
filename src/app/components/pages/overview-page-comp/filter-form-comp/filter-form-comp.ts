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

@Component({
  selector: 'app-filter-form-comp',
  imports: [IconComp, RadioComp, ReactiveFormsModule],
  templateUrl: './filter-form-comp.html',
  styleUrl: './filter-form-comp.scss'
})
export class FilterFormComp {
  private readonly _fb = inject(NonNullableFormBuilder)

  showFilter = signal(false)
  filter = output<LearnablesFilterConfig>()

  private initialValue: LearnablesFilterConfig = {
    type: 'all',
    confidence: 'all',
    orderBy: 'created',
    age: 'all',
    order: 'asc',
    search: ''
  }

  form = this._fb.group<LearnablesFilterConfig>(this.initialValue)

  formSignal = toSignal(this.form.valueChanges, {
    initialValue: this.initialValue
  })

  isInitialValue = computed(() => {
    const currentValue = this.formSignal()
    return JSON.stringify(currentValue) === JSON.stringify(this.initialValue)
  })

  constructor() {
    effect(() => {
      const filter = this.formSignal() as LearnablesFilterConfig
      untracked(() => {
        this.filter.emit(filter)
      })
    })
  }

  toggleExpanded() {
    this.showFilter.update((v) => !v)
  }
}
