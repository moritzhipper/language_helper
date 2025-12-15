import { Component, signal } from '@angular/core'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-onboarding-comp',
  imports: [IconComp],
  templateUrl: './onboarding-comp.html',
  styleUrl: './onboarding-comp.scss'
})
export class OnboardingComp {
  protected readonly activeIndex = signal(0)

  next() {
    if (this.activeIndex() < 3) {
      this.activeIndex.update((i) => i + 1)
    } else if (this.activeIndex() === 3) {
      // save language choice to store
      // set isOnboarded to true
    }
  }

  back() {
    if (this.activeIndex() > 0) {
      this.activeIndex.update((i) => i - 1)
    }
  }
}
