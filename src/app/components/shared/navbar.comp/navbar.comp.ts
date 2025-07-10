import { Component, inject, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LearnablesStore } from '../../../store/learnablesStore'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-navbar',
  imports: [ReactiveFormsModule, IconComp, RouterModule],
  templateUrl: './navbar.comp.html',
  styleUrl: './navbar.comp.scss',
  host: {
    '[class.links-open]': 'linksOpen()'
  }
})
export class NavbarComp {
  linksOpen = signal(false)
  private readonly lStore = inject(LearnablesStore)
  hasCurrentPractice = this.lStore.currentPractice

  toggleLinks() {
    this.linksOpen.update((o) => !o)
  }
}
