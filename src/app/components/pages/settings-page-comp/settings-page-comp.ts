import { Component, computed, inject } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BlobService } from '../../../services/blob-service'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { SettingsStore } from '../../../store/settingsStore'
import { BankBase, BankUser } from '../../../types_and_schemas/types'
import { pluralize } from '../../../utils/genaral-utils'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { BankSettingsComp } from './bank-settings-comp/bank-settings-comp'

@Component({
  selector: 'app-settings.comp',
  imports: [
    ReactiveFormsModule,
    BankSettingsComp,
    IconComp,
    PageHeaderComp,
    PageIconComp
  ],
  templateUrl: './settings-page-comp.html',
  styleUrl: './settings-page-comp.scss',
  host: { class: 'page mid' }
})
export class SettingsComp {
  private readonly _settingsS = inject(SettingsStore)
  private readonly _languageS = inject(LearnablesStore)
  private readonly _modalService = inject(ModalService)
  private readonly _toastS = inject(ToastService)
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
    const result = await this._modalService.open<BankBase>('edit-bank')
    if (result.type !== 'confirm') return

    this._languageS.addBank(result.value)
  }

  setActiveBank(id: string) {
    this._languageS.setActiveBank(id)
  }

  async editBank(bank: BankUser) {
    const result = await this._modalService.open<BankBase>('edit-bank', {
      preset: bank
    })
    if (result.type !== 'confirm') return

    this._languageS.updateBank(result.value, bank.id)
  }

  async shareBank(bank: BankUser) {
    const result = await this._modalService.open('bank-share', { bank })
    // put shared bank into shared banks storage
    // got to share page to copy the link
  }

  async deleteBank(id: string) {
    if (this._languageS.banks().length === 1) {
      this._toastS.showToast({
        type: 'error',
        message: `You can not delete the only bank.`
      })
      return
    }

    const result = await this._modalService.open('confirm', {
      message: `Are you sure you want to delete this bank?`
    })

    if (result.type !== 'confirm') return

    this._languageS.deleteBank(id)
  }

  downloadBank(bank: BankUser) {}

  protected updateKey(event: Event) {
    const input = event.target as HTMLInputElement
    this._settingsS.updateSettings({ apiKey: input.value })
  }
}
