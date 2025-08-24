import { Component, computed, effect, inject, untracked } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BlobService } from '../../../services/blob-service'
import { ModalService } from '../../../services/modal-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { SettingsStore } from '../../../store/settingsStore'
import { CounterComp } from '../../shared/counter-comp/counter-comp'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
@Component({
  selector: 'app-settings.comp',
  imports: [ReactiveFormsModule, PageWrapperComp, CounterComp],
  templateUrl: './settings-page-comp.html',
  styleUrl: './settings-page-comp.scss'
})
export class SettingsComp {
  private readonly _settingsS = inject(SettingsStore)
  private readonly _languageS = inject(LearnablesStore)
  private readonly _makeBlobS = inject(BlobService)
  private readonly _modalService = inject(ModalService)

  tokensUsed = this._settingsS.tokensUsed
  learnables = this._languageS.learnables
  collections = this._languageS.collections
  learnablesDownload = computed(() =>
    this._makeBlobS.createDownloadableFromLearnables(
      this._languageS.getExportable(),
      'All Cards'
    )
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

  async reset() {
    const result = await this._modalService.open('confirm', {
      message: `Delete ${this.learnables().length} cards and ${this.collections().length} collections?`,
      label: 'delete all of them!'
    })

    if (result.type !== 'confirm') return
    this._languageS.reset()
  }
}
