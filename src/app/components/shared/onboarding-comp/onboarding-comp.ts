import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SettingsStore } from '../../../store/settingsStore'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'app-onboarding-comp',
  imports: [IconComp, FormsModule],
  templateUrl: './onboarding-comp.html',
  styleUrl: './onboarding-comp.scss'
})
export class OnboardingComp {
  protected readonly activeIndex = signal(0)
  private readonly _settings = inject(SettingsStore)

  protected apiKey = this._settings.apiKey

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

  updateApiKey(apiKey: string) {
    this._settings.updateSettings({ apiKey })
  }
}
