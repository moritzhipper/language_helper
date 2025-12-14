import { Component, signal } from '@angular/core'
import { OnboardingSectionComp } from './onboarding-section-comp/onboarding-section-comp'

@Component({
  selector: 'app-onboarding-comp',
  imports: [OnboardingSectionComp],
  templateUrl: './onboarding-comp.html',
  styleUrl: './onboarding-comp.scss'
})
export class OnboardingComp {
  protected readonly activeIndex = signal(0)

  next() {
    this.activeIndex.update((i) => i + 1)
  }
}
