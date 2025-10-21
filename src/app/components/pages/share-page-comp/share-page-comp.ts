import { Component, inject } from '@angular/core'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { BankExport, BankExportOnline } from '../../../types_and_schemas/types'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
import { mockOnlineBanks, mockUserBanks } from './mockBanks'
import { SharedBankComp } from './shared-collection-comp/shared-bank-comp'

const enhance = (bank: BankExport): BankExportOnline => {
  return {
    ...bank,
    created: new Date(),
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    id: crypto.randomUUID()
  }
}

@Component({
  selector: 'app-share-page-comp',
  imports: [PageWrapperComp, SharedBankComp],
  templateUrl: './share-page-comp.html',
  styleUrl: './share-page-comp.scss'
})
export class SharePageComp {
  private readonly _toastS = inject(ToastService)
  private readonly _modalService = inject(ModalService)
  private readonly _lStore = inject(LearnablesStore)

  userBanks = mockUserBanks.map(enhance)
  onlineBanks = mockOnlineBanks.map(enhance)

  protected async copyLink(bank: BankExportOnline) {
    try {
      await navigator.clipboard.writeText(this.generateLink(bank.id))

      this._toastS.showToast({
        type: 'info',
        message: `Link to ${bank.name} copied to clipboard`
      })
    } catch {
      this._toastS.showToast({
        type: 'error',
        message: `Failed to copy link. Do you have the clipboard permissions enabled?`
      })
    }
  }

  protected async importBank(bank: BankExportOnline) {
    const result = await this._modalService.open<BankExportOnline>(
      'bank-import',
      {
        bankExport: bank
      }
    )

    if (result.type !== 'confirm') return

    // todo: handle import of filetype BankExportOnline
    debugger
    this._lStore.importBankExport(result.value)
  }

  private generateLink(id: string): string {
    const url = new URL(window.location.origin)
    url.searchParams.set('id', id)
    return url.toString()
  }
}
