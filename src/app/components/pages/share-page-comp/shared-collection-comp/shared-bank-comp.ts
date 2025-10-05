import { DatePipe } from '@angular/common'
import {
  Component,
  computed,
  input,
  OnDestroy,
  output,
  signal
} from '@angular/core'
import { BankExportOnline } from '../../../../types_and_schemas/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

type Counter = {
  cards: number
  words: string
  phrases: string
  collections: string
}

@Component({
  selector: 'app-shared-bank-comp',
  imports: [IconComp, DatePipe],
  templateUrl: './shared-bank-comp.html',
  styleUrl: './shared-bank-comp.scss'
})
export class SharedBankComp implements OnDestroy {
  /**
   * Todo:
   *
   * mark already imported collections, but allow re-importing
   * show time left to import: days, hours or minutes, depending on time left
   *
   *
   *
   *
   */
  bank = input.required<BankExportOnline>()
  currentTime = signal(Date.now())

  private timeInterval = setInterval(() => {
    this.currentTime.set(Date.now())
  }, 1000)

  copyId = output<void>()

  protected readonly counter = computed<Counter>(() => ({
    cards: this.bank().learnables.length,
    words: this.pluralize(
      this.bank().learnables.filter((l) => l.type === 'word').length,
      'word'
    ),
    phrases: this.pluralize(
      this.bank().learnables.filter((l) => l.type === 'phrase').length,
      'phrase'
    ),
    collections: this.pluralize(this.bank().collections.length, 'collection')
  }))

  protected readonly ttl = computed(() => {
    const expires = this.bank().expires
    const diffMs = expires.getTime() - this.currentTime()

    // If already expired
    if (diffMs <= 0) {
      return {
        label: 'expired',
        isExpired: true
      }
    }

    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    let ttlString = ''
    // More than a week: show the date
    if (diffDays > 7) {
      ttlString = expires.toLocaleDateString()
    } else if (diffDays > 0) {
      ttlString = this.pluralize(diffDays, 'day')
    } else if (diffHours > 0) {
      ttlString = this.pluralize(diffHours, 'hour')
    } else if (diffMinutes > 0) {
      ttlString = this.pluralize(diffMinutes, 'minute')
    } else {
      ttlString = this.pluralize(diffSeconds, 'second')
    }

    return {
      label: `expires in ${ttlString}`,
      isExpired: false
    }
  })

  ngOnDestroy(): void {
    clearInterval(this.timeInterval)
  }

  private pluralize(count: number, unit: string): string {
    const pluralS = count !== 1 ? 's' : ''
    return `${count} ${unit}${pluralS}`
  }
}
