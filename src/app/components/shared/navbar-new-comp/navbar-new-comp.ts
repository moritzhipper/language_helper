import {
  Component,
  computed,
  HostListener,
  inject,
  signal
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router'
import { filter } from 'rxjs'
import { LearnablesStore } from '../../../store/learnablesStore'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-navbar-new-comp',
  imports: [IconComp, RouterLink, RouterLinkActive],
  templateUrl: './navbar-new-comp.html',
  styleUrls: ['./navbar-new-comp.scss', './phone.scss', './desktop.scss']
})
export class NavbarNewComp {
  @HostListener('mouseenter')
  onenter() {
    this.mousehovering = true
  }

  @HostListener('mouseleave')
  onleave() {
    if (this.mousehovering) {
      this.isOpen.set(false)
      this.mousehovering = false
    }
  }

  // delay closing via link click a bit to show active link change animation
  private readonly navEvent$ = inject(Router).events.pipe(
    filter((e) => e instanceof NavigationEnd),
    takeUntilDestroyed()
  )

  private mousehovering: boolean = false

  protected readonly lstore = inject(LearnablesStore)
  protected readonly language = computed(
    () => this.lstore.activeBank().language
  )
  protected readonly isOpen = signal(false)
  protected readonly isOnPracticePage = signal(false)
  protected readonly hasActivePractice = this.lstore.currentPractice

  constructor() {
    this.navEvent$.subscribe((ev) => {
      if (!this.mousehovering) {
        this.isOpen.set(false)
      }
      this.isOnPracticePage.set(ev.urlAfterRedirects.includes('practice'))
    })
  }

  toggle() {
    this.isOpen.set(!this.isOpen())
  }
}
