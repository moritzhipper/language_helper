import { Component, HostListener, signal } from '@angular/core'
import { config } from '../../../../../config'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../../../shared/page-wrapper-comp/page-wrapper-comp'

@Component({
  selector: 'app-active-practice-comp',
  imports: [IconComp, PageWrapperComp],
  templateUrl: './active-practice-comp.html',
  styleUrl: './active-practice-comp.scss'
})
export class ActivePracticeComp {
  @HostListener('window:keydown', ['$event']) handleKeyDown(
    event: KeyboardEvent
  ) {
    if (event.key === 'ArrowUp') {
      this.reveal()
    } else if (event.key === 'ArrowLeft' && this.isRevealed()) {
      this.onSetGuess(false)
    } else if (event.key === 'ArrowRight' && this.isRevealed()) {
      this.onSetGuess(true)
    }
  }

  protected isRevealed = signal(false)
  protected showStats = signal(false)

  reveal() {
    this.isRevealed.set(true)
  }

  toggleStats() {
    this.showStats.update((v) => !v)
  }

  onSetGuess(guess: boolean) {}

  private getRandomExp(isHappy: boolean): string {
    if (isHappy) return this.getRandomElementFromArray(config.happyExpressions)
    return this.getRandomElementFromArray(config.sadExpressions)
  }

  private getRandomElementFromArray(arr: string[]): string {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
  }
}
