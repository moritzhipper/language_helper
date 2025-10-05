import { Component } from '@angular/core'
import { BankExport } from '../../../types_and_schemas/types'
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

@Component({
  selector: 'app-share-page-comp',
  imports: [PageWrapperComp, SharedBankComp],
  templateUrl: './share-page-comp.html',
  styleUrl: './share-page-comp.scss'
})
export class SharePageComp {
  userBanks = mockUserBanks
  onlineBanks = mockOnlineBanks
}
