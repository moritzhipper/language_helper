import { DatePipe } from '@angular/common'
import { Component, input, output } from '@angular/core'
import { BankUser } from '../../../../types_and_schemas/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-bank-settings-card',
  imports: [IconComp, DatePipe],
  templateUrl: './bank-settings-comp.html',
  styleUrl: './bank-settings-comp.scss'
})
export class BankSettingsComp {
  bank = input.required<BankUser>()
  isActive = input.required<boolean>()
  share = output<void>()

  edit = output<void>()
  setActive = output<void>()
  delete = output<void>()
  download = output<void>()
}
