import { Component, signal } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { IconComp, IconType } from '../icon-comp/icon-comp'

type PageConfig = {
  icon: IconType
  header: string
  mode: 'full' | 'compact'
}

const DEFAULT_PAGE_CONFIG: PageConfig = {
  icon: 'learn',
  mode: 'compact',
  header: ''
}

@Component({
  selector: 'app-navbar-new-comp',
  imports: [IconComp, RouterLinkActive, RouterLink],
  templateUrl: './navbar-new-comp.html',
  styleUrl: './navbar-new-comp.scss',
  host: {
    '[class.open]': 'isOpen()'
  }
})
export class NavbarNewComp {
  isOpen = signal(true)

  toggle() {
    this.isOpen.set(!this.isOpen())
  }
}
