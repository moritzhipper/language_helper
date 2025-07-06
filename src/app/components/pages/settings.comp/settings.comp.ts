import { Component, effect, inject, untracked } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { LearnablesStore } from '../../../store/learnablesStore'
import { SettingsStore } from '../../../store/settingsStore'
import { CounterComp } from '../../shared/counter-comp/counter-comp'
import { PageWrapperComp } from '../page-wrapper-comp/page-wrapper-comp'
@Component({
  selector: 'app-settings.comp',
  imports: [ReactiveFormsModule, PageWrapperComp, CounterComp],
  templateUrl: './settings.comp.html',
  styleUrl: './settings.comp.scss'
})
export class SettingsComp {
  private readonly _settingsS = inject(SettingsStore)
  private readonly _languageS = inject(LearnablesStore)

  tokensUsed = this._settingsS.tokensUsed
  learnables = this._languageS.learnables

  form = new FormGroup({
    apiKey: new FormControl('', { nonNullable: true }),
    learningLang: new FormControl('', { nonNullable: true }),
    speakingLang: new FormControl('', { nonNullable: true })
  })
  formSignal = toSignal(this.form.valueChanges)

  constructor() {
    this.form.setValue({
      apiKey: this._settingsS.apiKey(),
      learningLang: this._settingsS.learningLang(),
      speakingLang: this._settingsS.speakingLang()
    })
    effect(() => {
      const formValue = this.formSignal()
      untracked(() => {
        if (!formValue) return
        this._settingsS.updateSettings(formValue)
      })
    })
  }
}
