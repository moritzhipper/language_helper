import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MakeBlobService } from '../../../services/make-blob-service'
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
  private readonly _makeBlobS = inject(MakeBlobService)

  // only delete after tree consecutive presses
  private deleteTimeout: ReturnType<typeof setTimeout> | null = null
  deletePressedCounter = signal(0)
  necessaryDeletePresses = 5

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
    if (this.deleteTimeout) {
      clearTimeout(this.deleteTimeout)
    }
    this.deleteTimeout = setTimeout(
      () => this.deletePressedCounter.set(0),
      1000
    )
    this.deletePressedCounter.update((value) => value + 1)

    if (this.deletePressedCounter() >= this.necessaryDeletePresses) {
      this._languageS.reset()
    }
  }
}
