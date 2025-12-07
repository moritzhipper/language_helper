import { Component, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router'
import { delay, filter } from 'rxjs'
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
  imports: [IconComp, RouterLink, RouterLinkActive],
  templateUrl: './navbar-new-comp.html',
  styleUrls: ['./navbar-new-comp.scss', './phone.scss', './desktop.scss']
})
export class NavbarNewComp {
  // delay closing via linkclick a bit to show acitve link change animation
  private readonly navEvent$ = inject(Router).events.pipe(
    filter((e) => e instanceof NavigationEnd),
    delay(400),
    takeUntilDestroyed()
  )

  isOpen = signal(false)
  lstore = inject(LearnablesStore)
  bank = this.lstore.activeBank

  constructor() {
    this.navEvent$.subscribe(() => {
      this.isOpen.set(false)
    })
  }

  toggle() {
    this.isOpen.set(!this.isOpen())
  }
}
