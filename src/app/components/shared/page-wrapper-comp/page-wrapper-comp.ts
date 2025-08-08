import { Component, input } from '@angular/core'
import { IconComp, IconType } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-page-wrapper-comp',
  imports: [IconComp],
  templateUrl: './page-wrapper-comp.html',
  styleUrl: './page-wrapper-comp.scss',
  host: {
    '[class.shrink-on-desktop]': 'desktopMode() === "shrink"',
    '[class.center-on-desktop]': 'desktopMode() === "center"'
  }
})
export class PageWrapperComp {
  title = input<string>()
  desktopMode = input<'shrink' | 'center' | 'full'>('full')
  icon = input<IconType | null>(null)
}
