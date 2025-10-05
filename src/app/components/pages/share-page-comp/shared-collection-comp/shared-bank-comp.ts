import { DatePipe } from '@angular/common'
import { Component, computed, input } from '@angular/core'
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
export class SharedBankComp {
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

  holdsMultipleCollections = computed(
    () => this.bank().collections.length === 1
  )

  header = computed(() => {
    return this.holdsMultipleCollections()
      ? this.bank().collections[0].name
      : this.bank().name
  })

  counter = computed<Counter>(() => ({
    cards: this.bank().learnables.length,
    words: this.bank().learnables.filter((l) => l.type === 'word').length,
    phrases: this.bank().learnables.filter((l) => l.type === 'phrase').length,
    collections: this.bank().collections.length
  }))
}
