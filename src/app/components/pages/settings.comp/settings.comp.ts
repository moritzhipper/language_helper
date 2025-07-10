import { Component, computed, effect, inject, untracked } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MakeBlobService } from '../../../services/make-blob-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { SettingsStore } from '../../../store/settingsStore'
import { ConfirmFormComp } from '../../shared/confirm-form-comp/confirm-form-comp'
import { CounterComp } from '../../shared/counter-comp/counter-comp'
import { ModalWrapperComp } from '../../shared/modal-wrapper-comp/modal-wrapper-comp'
import { PageWrapperComp } from '../page-wrapper-comp/page-wrapper-comp'
@Component({
  selector: 'app-settings.comp',
  imports: [
    ReactiveFormsModule,
    PageWrapperComp,
    CounterComp,
    ModalWrapperComp,
    ConfirmFormComp
  ],
  templateUrl: './settings.comp.html',
  styleUrl: './settings.comp.scss'
})
export class SettingsComp {
  private readonly _settingsS = inject(SettingsStore)
  private readonly _languageS = inject(LearnablesStore)
  private readonly _makeBlobS = inject(MakeBlobService)

  // only delete after tree consecutive presses
  private deleteTimeout: ReturnType<typeof setTimeout> | null = null

  tokensUsed = this._settingsS.tokensUsed
  learnables = this._languageS.learnables
  learnablesDownload = computed(() =>
    this._makeBlobS.createDownloadableFromLearnables(this.learnables())
  )

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

  reset() {
    this._languageS.reset()
  }
}
