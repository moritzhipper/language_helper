import { Component, inject } from '@angular/core'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { BankShare } from '../../../types_and_schemas/types'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
import { mockOnlineBanks, mockUserBanks } from './mockBanks'
import { SharedBankComp } from './shared-collection-comp/shared-bank-comp'

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

  userBanks = mockUserBanks
  onlineBanks = mockOnlineBanks

  protected async copyLink(bank: BankShare) {
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

  protected async importBank(bank: BankShare) {
    const result = await this._modalService.open<BankShare>('bank-import', {
      bankExport: bank
    })

    if (result.type !== 'confirm') return
    this._lStore.importBankExport(result.value)
  }

  private generateLink(id: string): string {
    const url = new URL(window.location.origin)
    url.searchParams.set('id', id)
    return url.toString()
  }
}
