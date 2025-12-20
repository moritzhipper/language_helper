import { DatePipe } from '@angular/common'
import {
  Component,
  computed,
  input,
  OnDestroy,
  output,
  signal
} from '@angular/core'
import { BankShare } from '../../../../types_and_schemas/types'
import { pluralize } from '../../../../utils/genaral-utils'
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
  styleUrl: './shared-bank-comp.scss',
  host: {
    '[class.community]': 'isCommunityBank()'
  }
})
export class SharedBankComp implements OnDestroy {
  bank = input.required<BankShare>()
  allowImport = input<boolean>(true)
  copyId = output<void>()
  importBank = output<void>()

  isCommunityBank = input<boolean>(false)

  hasMultipleCollections = computed(() => this.bank().collections.length > 1)

  private readonly currentTime = signal(Date.now())

  private timeInterval = setInterval(() => {
    this.currentTime.set(Date.now())
  }, 1000)

  protected readonly counter = computed<Counter>(() => {
    const { collections, learnables } = this.bank()

    return {
      cards: collections.length,
      words: pluralize(
        learnables.filter((l) => l.type === 'word').length,
        'word'
      ),
      phrases: pluralize(
        learnables.filter((l) => l.type === 'phrase').length,
        'phrase'
      ),
      collections: pluralize(collections.length, 'collection')
    }
  })

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
      ttlString = pluralize(diffDays, 'day')
    } else if (diffHours > 0) {
      ttlString = pluralize(diffHours, 'hour')
    } else if (diffMinutes > 0) {
      ttlString = pluralize(diffMinutes, 'minute')
    } else {
      ttlString = pluralize(diffSeconds, 'second')
    }

    return {
      label: `expires in ${ttlString}`,
      isExpired: false
    }
  })

  ngOnDestroy(): void {
    clearInterval(this.timeInterval)
  }
}
