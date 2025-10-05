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
  words: number
  phrases: number
  collections: number
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

  protected readonly holdsMultipleCollections = computed(
    () => this.bank().collections.length === 1
  )

  protected readonly header = computed(() => {
    return this.holdsMultipleCollections()
      ? this.bank().collections[0].name
      : this.bank().name
  })

  protected readonly counter = computed<Counter>(() => ({
    cards: this.bank().learnables.length,
    words: this.bank().learnables.filter((l) => l.type === 'word').length,
    phrases: this.bank().learnables.filter((l) => l.type === 'phrase').length,
    collections: this.bank().collections.length
  }))

  protected readonly ttl = computed(() => {
    const expires = this.bank().expires
    const diffMs = expires.getTime() - this.currentTime()

    // If already expired
    if (diffMs <= 0) {
      return 'Expired'
    }

    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    // More than a week: show the date
    if (diffDays > 7) {
      return expires.toLocaleDateString()
    }

    // Less than a week: show the biggest unit
    if (diffDays > 0) {
      return this.pluralize(diffDays, 'day')
    }

    if (diffHours > 0) {
      return this.pluralize(diffHours, 'hour')
    }

    if (diffMinutes > 0) {
      return this.pluralize(diffMinutes, 'minute')
    }

    return this.pluralize(diffSeconds, 'second')
  })

  ngOnDestroy(): void {
    clearInterval(this.timeInterval)
  }

  private pluralize(count: number, unit: string): string {
    const pluralS = count !== 1 ? 's' : ''
    return `${count} ${unit}${pluralS}`
  }
}
