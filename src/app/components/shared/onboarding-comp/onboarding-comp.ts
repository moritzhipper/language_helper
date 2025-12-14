import { Component, signal } from '@angular/core'
import { IconComp } from '../icon-comp/icon-comp'
import { OnboardingSectionComp } from './onboarding-section-comp/onboarding-section-comp'

@Component({
  selector: 'app-onboarding-comp',
  imports: [OnboardingSectionComp, IconComp],
  templateUrl: './onboarding-comp.html',
  styleUrl: './onboarding-comp.scss'
})
export class OnboardingComp {
  protected readonly activeIndex = signal(0)

  next() {
    if (this.activeIndex() < 3) {
      this.activeIndex.update((i) => i + 1)
    }
  }

  back() {
    if (this.activeIndex() > 0) {
      this.activeIndex.update((i) => i - 1)
    }
  }
}
