import { Component, inject, signal } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { LearnablesStore } from '../../../store/learnablesStore'
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
  styleUrls: ['./navbar-new-comp.scss', './phone.scss', './desktop.scss']
})
export class NavbarNewComp {
  isOpen = signal(true)
  lstore = inject(LearnablesStore)
  bank = this.lstore.activeBank

  toggle() {
    this.isOpen.set(!this.isOpen())
  }
}
