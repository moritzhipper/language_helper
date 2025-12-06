import { Component, input } from '@angular/core'
import { IconComp, IconType } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-page-icon-comp',
  imports: [IconComp],
  templateUrl: './page-icon-comp.html',
  styleUrl: './page-icon-comp.scss'
})
export class PageIconComp {
  type = input.required<IconType>()
}
