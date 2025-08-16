import { Component, computed, effect, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ReactiveFormsModule } from '@angular/forms'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { LearnablesStore } from '../../../store/learnablesStore'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-navbar',
  imports: [ReactiveFormsModule, IconComp, RouterModule],
  templateUrl: './navbar-comp.html',
  styleUrl: './navbar-comp.scss',
  host: {
    '[class.open]': 'linksAreOpen()'
  }
})
export class NavbarComp {
  private readonly lStore = inject(LearnablesStore)
  private _router = inject(Router)
  private _navEvent = toSignal(this._router.events)

  linksAreOpen = signal(false)
  hasCurrentPractice = this.lStore.currentPractice
  isOnPracticePage = computed(() => {
    const e = this._navEvent()
    if (e instanceof NavigationEnd) return e.urlAfterRedirects === '/practice'
    return false
  })

  pulseToggle = computed(
    () =>
      !this.isOnPracticePage() &&
      !this.linksAreOpen() &&
      this.hasCurrentPractice()
  )
  subdueToggle = computed(
    () =>
      this.isOnPracticePage() &&
      !this.linksAreOpen() &&
      this.hasCurrentPractice()
  )
  pulsePractice = computed(
    () => this.linksAreOpen() && this.hasCurrentPractice()
  )

  constructor() {
    effect(() => {
      this._navEvent()
      this.linksAreOpen.set(false)
    })
  }

  toggleLinks() {
    this.linksAreOpen.update((o) => !o)
  }
}
