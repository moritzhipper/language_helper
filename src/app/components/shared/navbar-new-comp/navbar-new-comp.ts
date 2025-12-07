import { Component, computed, inject, signal } from '@angular/core'
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
  // delay closing via link click a bit to show active link change animation
  private readonly navEvent$ = inject(Router).events.pipe(
    filter((e) => e instanceof NavigationEnd),
    delay(400),
    takeUntilDestroyed()
  )

  protected readonly lstore = inject(LearnablesStore)
  protected readonly language = computed(
    () => this.lstore.activeBank().language
  )
  protected readonly isOpen = signal(false)
  protected readonly hasActivePractice = this.lstore.currentPractice

  constructor() {
    this.navEvent$.subscribe(() => {
      this.isOpen.set(false)
    })
  }

  toggle() {
    this.isOpen.set(!this.isOpen())
  }
}
