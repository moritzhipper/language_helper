import { Component, inject } from '@angular/core'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { BankShare } from '../../../types_and_schemas/types'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { mockOnlineBanks, mockUserBanks } from './mockBanks'
import { SharedBankComp } from './shared-collection-comp/shared-bank-comp'

@Component({
  selector: 'app-share-page-comp',
  imports: [PageHeaderComp, PageIconComp, SharedBankComp, IconComp],
  templateUrl: './share-page-comp.html',
  styleUrl: './share-page-comp.scss',
  host: {
    class: 'page mid'
  }
})
export class SharePageComp {
  private readonly _toastS = inject(ToastService)
  private readonly _modalService = inject(ModalService)
  private readonly _lStore = inject(LearnablesStore)

  protected readonly MAX_PREVIEW_BANKS = 5

  userBanks: BankShare[] = mockUserBanks(3)

  sections: { title: string; banks: BankShare[] }[] = [
    {
      title: 'Popular for your language match',
      banks: mockOnlineBanks(this.MAX_PREVIEW_BANKS)
    },
    {
      title: 'New for your language match',
      banks: mockOnlineBanks(this.MAX_PREVIEW_BANKS)
    },
    {
      title: 'Popular for other matches',
      banks: mockOnlineBanks(this.MAX_PREVIEW_BANKS)
    },
    {
      title: 'New for other matches',
      banks: mockOnlineBanks(this.MAX_PREVIEW_BANKS)
    }
  ]

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
      bank
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
