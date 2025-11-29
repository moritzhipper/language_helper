import { Component, computed, inject } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BlobService } from '../../../services/blob-service'
import { ModalService } from '../../../services/modal-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { SettingsStore } from '../../../store/settingsStore'
import { BankBase } from '../../../types_and_schemas/types'
import { pluralize } from '../../../utils/genaral-utils'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
import { BankSettingsComp } from './bank-settings-comp/bank-settings-comp'

@Component({
  selector: 'app-settings.comp',
  imports: [ReactiveFormsModule, PageWrapperComp, BankSettingsComp, IconComp],
  templateUrl: './settings-page-comp.html',
  styleUrl: './settings-page-comp.scss'
})
export class SettingsComp {
  private readonly _settingsS = inject(SettingsStore)
  private readonly _languageS = inject(LearnablesStore)
  private readonly _modalService = inject(ModalService)
  private readonly _blobS = inject(BlobService)

  protected tokensUsed = this._settingsS.tokensUsed
  protected apiKey = this._settingsS.apiKey

  protected banks = this._languageS.banks
  protected activeBankId = computed(() => this._languageS.activeBank().id)
  protected stats = computed(() => {
    const banksCount = this._languageS.banks().length
    const collectionsCount = this._languageS
      .banks()
      .reduce((acc, bank) => acc + bank.collections.length, 0)
    const learnablesCount = this._languageS
      .banks()
      .reduce((acc, bank) => acc + bank.learnables.length, 0)
    return {
      banks: pluralize(banksCount, 'bank'),
      collections: pluralize(collectionsCount, 'collection'),
      learnables: pluralize(learnablesCount, 'learnable')
    }
  })

  async reset() {
    const { banks, collections, learnables } = this.stats()
    const result = await this._modalService.open('confirm', {
      message: `Delete alle banks, collections, cards and reset this app to default?`,
      label: 'yup, do it!'
    })

    if (result.type !== 'confirm') return
    this._languageS.reset()
    this._settingsS.reset()
  }

  async createNewBank() {
    const result = await this._modalService.open<BankBase>('add-bank')
    if (result.type !== 'confirm') return

    this._languageS.addBank(result.value)
  }

  setActiveBank(id: string) {
    this._languageS.setActiveBank(id)
  }

  editBank(id: string) {
    const bank = this._languageS.banks().find((b) => b.id === id)
    if (!bank) return
  }

  deleteBank(id: string) {
    // this._languageS.deleteBank(id)
  }

  downloadBank(id: string) {}

  protected updateKey(event: Event) {
    const input = event.target as HTMLInputElement
    this._settingsS.updateSettings({ apiKey: input.value })
  }
}
