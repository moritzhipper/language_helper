import { Component, inject, output } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { CounterComp } from '../../../shared/counter-comp/counter-comp'
import { PageWrapperComp } from '../../../shared/page-wrapper-comp/page-wrapper-comp'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'

@Component({
  selector: 'app-configure-practice-comp',
  imports: [PageWrapperComp, CounterComp, RadioComp, ReactiveFormsModule],
  templateUrl: './configure-practice-comp.html',
  styleUrl: './configure-practice-comp.scss'
})
export class ConfigurePracticeComp {
  start = output<void>()

  private readonly _fb = inject(NonNullableFormBuilder)
  form = this._fb.group({
    type: null,
    collectionIdentifier: 'All',
    confidence: undefined,
    reverseDirection: false
  })

  private readonly _formSignal = toSignal(this.form.valueChanges, {
    initialValue: this.form.value
  })
}
