import { Component, input } from '@angular/core'
import { IconComp, IconType } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-page-header-comp',
  imports: [IconComp],
  templateUrl: './cool-header-comp.html',
  styleUrl: './cool-header-comp.scss'
})
export class CoolHeaderComp {
  icon = input.required<IconType>()
}
