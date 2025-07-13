import {
  Component,
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

  form = this._fb.group<LearnablesFilterConfig>({
    type: 'all',
    confidence: 'low',
    orderBy: 'created',
    order: 'asc',
    age: 'all',
    search: ''
  })

  formSignal = toSignal(this.form.valueChanges, {
    initialValue: this.form.value
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
