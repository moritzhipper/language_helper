import { Component, effect, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ReactiveFormsModule } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { LearnablesStore } from '../../../store/learnablesStore'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-navbar',
  imports: [ReactiveFormsModule, IconComp, RouterModule],
  templateUrl: './navbar.comp.html',
  styleUrl: './navbar.comp.scss',
  host: {
    '[class.links-open]': 'linksOpen()',
    '[class.practicing]': 'hasCurrentPractice()'
  }
})
export class NavbarComp {
  linksOpen = signal(false)
  private readonly lStore = inject(LearnablesStore)
  hasCurrentPractice = this.lStore.currentPractice
  private _router = inject(Router)

  private _navEnd = toSignal(this._router.events)

  constructor() {
    effect(() => {
      this._navEnd()
      this.linksOpen.set(false)
    })
  }

  activeRoute = signal('')

  toggleLinks() {
    this.linksOpen.update((o) => !o)
  }
}
