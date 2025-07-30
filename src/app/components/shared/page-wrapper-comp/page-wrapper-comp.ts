import { Component, input } from '@angular/core'
import { IconComp, IconType } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-page-wrapper-comp',
  imports: [IconComp],
  templateUrl: './page-wrapper-comp.html',
  styleUrl: './page-wrapper-comp.scss',
  host: {
    '[class.shrink-on-desktop]': 'shrinkOnDesktop()'
  }
})
export class PageWrapperComp {
  title = input<string>()
  shrinkOnDesktop = input(true)
  icon = input<IconType | null>(null)
}
