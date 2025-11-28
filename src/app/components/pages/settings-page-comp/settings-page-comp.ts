import { Component, computed, effect, inject, untracked } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { BlobService } from '../../../services/blob-service'
import { ModalService } from '../../../services/modal-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { SettingsStore } from '../../../store/settingsStore'
import { mapToBankExport } from '../../../utils/import-export-utils'
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
  private readonly _modalService = inject(ModalService)
  private readonly _blobS = inject(BlobService)
  tokensUsed = this._settingsS.tokensUsed
  protected bank = this._languageS.activeBank
  protected stats = computed(() => {
    const banksCount = this._languageS.banks().length
    const learnablesCount = this._languageS
      .banks()
      .map((b) => b.learnables.length)
      .reduce((a, b) => a + b, 0)
    const collectionsCount = this._languageS
      .banks()
      .map((b) => b.collections.length)
      .reduce((a, b) => a + b, 0)
    return {
      banksCount,
      learnablesCount,
      collectionsCount
    }
  })

  learnablesDownload = computed(() => {
    const bankExport = mapToBankExport(this.bank())
    return this._blobS.createDownloadableFromLearnables(bankExport)
  })

  form = new FormGroup({
    apiKey: new FormControl('', { nonNullable: true }),
    learningLanguage: new FormControl('', { nonNullable: true }),
    speakingLanguage: new FormControl('', { nonNullable: true })
  })
  formSignal = toSignal(this.form.valueChanges)

  constructor() {
    this.form.setValue({
      apiKey: this._settingsS.apiKey(),
      learningLanguage: this.bank().language.learning,
      speakingLanguage: this.bank().language.speaking
    })
    effect(() => {
      const formValue = this.formSignal()
      untracked(() => {
        if (!formValue) return

        const { apiKey, learningLanguage, speakingLanguage } = formValue

        this._settingsS.updateSettings({ apiKey })
        this._languageS.editBankLanguage({
          learning: learningLanguage as string,
          speaking: speakingLanguage as string
        })
      })
    })
  }

  async reset() {
    const { banksCount, collectionsCount, learnablesCount } = this.stats()
    const result = await this._modalService.open('confirm', {
      message: `Delete ${banksCount} banks, ${learnablesCount} cards and ${collectionsCount} collections?`,
      label: 'delete all of them!'
    })

    if (result.type !== 'confirm') return
    this._languageS.reset()
  }

  async createNewBank() {
    const result = await this._modalService.open('add-bank')
    if (result.type !== 'confirm') return

    // this._languageS.addBank(result.value)
  }
}
