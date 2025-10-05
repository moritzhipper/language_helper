import { Component, inject } from '@angular/core'
import { ToastService } from '../../../services/toast-service'
import { BankExport, BankExportOnline } from '../../../types_and_schemas/types'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
import { SharedBankComp } from './shared-collection-comp/shared-bank-comp'

export const mockUserBanks: BankExport[] = [
  {
    name: 'Business Presentation',

    learnables: [],
    collections: []
  },
  {
    name: 'Cafe',
    learnables: [],
    collections: []
  },

  {
    name: 'Light Conversation',
    learnables: [],
    collections: []
  }
]

export const mockOnlineBanks: BankExport[] = [
  {
    name: 'Selling Stuff Online',
    learnables: [],
    collections: []
  },
  {
    name: 'Talking to a Cute Dog',
    learnables: [],
    collections: []
  }
]

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
  private _toastS = inject(ToastService)

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

  private generateLink(id: string): string {
    const url = new URL(window.location.origin)
    url.searchParams.set('id', id)
    return url.toString()
  }
}
