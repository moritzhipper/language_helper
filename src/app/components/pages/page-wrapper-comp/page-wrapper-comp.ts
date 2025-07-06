import { Component, input } from '@angular/core'

@Component({
  selector: 'app-page-wrapper-comp',
  imports: [],
  templateUrl: './page-wrapper-comp.html',
  styleUrl: './page-wrapper-comp.scss',
  host: {
    '[class.shrink-on-desktop]': 'shrinkOnDesktop()'
  }
})
export class PageWrapperComp {
  title = input<string>()
  shrinkOnDesktop = input(true)
}
