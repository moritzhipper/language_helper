import { Component, inject, signal } from '@angular/core'
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { LearnablesStore } from '../../../store/learnablesStore'
import { SettingsStore } from '../../../store/settingsStore'
import { BankBase, LanguageConfig } from '../../../types_and_schemas/types'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-onboarding-comp',
  imports: [IconComp, FormsModule, ReactiveFormsModule],
  templateUrl: './onboarding-comp.html',
  styleUrl: './onboarding-comp.scss'
})
export class OnboardingComp {
  protected readonly activeIndex = signal(0)
  private readonly _settings = inject(SettingsStore)
  private readonly _lStore = inject(LearnablesStore)

  protected apiKey = this._settings.apiKey

  protected readonly _fb = inject(NonNullableFormBuilder)

  languageForm = this._fb.group({
    learning: ['', Validators.required],
    speaking: ['', Validators.required]
  })

  next() {
    if (this.activeIndex() < 3) {
      this.activeIndex.update((i) => i + 1)
    } else if (this.activeIndex() === 3 && this.languageForm.valid) {
      this.createFirstBank()
    }
  }

  back() {
    if (this.activeIndex() > 0) {
      this.activeIndex.update((i) => i - 1)
    }
  }

  updateApiKey(apiKey: string) {
    this._settings.updateSettings({ apiKey })
  }

  createFirstBank() {
    const language = this.languageForm.value as LanguageConfig
    const bank: BankBase = {
      name: 'My First Language Bank',
      language
    }
    this._lStore.addBank(bank)
  }
}
