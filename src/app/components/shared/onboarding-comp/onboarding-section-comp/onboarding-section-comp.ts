import { Component, input } from '@angular/core'
import { IconComp, IconType } from '../../icon-comp/icon-comp'

@Component({
  selector: 'app-onboarding-section-comp',
  imports: [IconComp],
  templateUrl: './onboarding-section-comp.html',
  styleUrl: './onboarding-section-comp.scss'
})
export class OnboardingSectionComp {
  icon = input.required<IconType>()
}
