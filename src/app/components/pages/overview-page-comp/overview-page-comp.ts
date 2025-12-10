import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LearnablesStore } from '../../../store/learnablesStore'
import {
  CollectionUser,
  LearnablesFilterConfig
} from '../../../types_and_schemas/types'
import {
  calculateAverageConfidencePercent,
  removeDuplicates
} from '../../../utils/genaral-utils'
import { filterLearnables } from '../../../utils/learnables-filter'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageHeaderComp } from '../../shared/page-header-comp/page-header-comp'
import { PageIconComp } from '../../shared/page-icon-comp/page-icon-comp'
import { CollectionInfoComp } from './collection-info-comp/collection-info-comp'
import { CollectionInteractComp } from './collection-interact-comp/collection-interact-comp'
import { EditBubblesComp } from './edit-bubbles-comp/edit-bubbles-comp'
import {
  FilterFormComp,
  LearnablesFilterFormType
} from './filter-form-comp/filter-form-comp'
import { LearnableComp } from './learnable-comp/learnable-comp'
import { OverviewPageFacade } from './overview-page-facade'

/**
 * Overview page component.
 * Manages all UI state and delegates business logic to the facade service.
 */
@Component({
  selector: 'app-overview',
  templateUrl: './overview-page-comp.html',
  styleUrl: './overview-page-comp.scss',
  imports: [
    CollectionInfoComp,
    ReactiveFormsModule,
    LearnableComp,
    IconComp,
    FilterFormComp,
    FormsModule,
    EditBubblesComp,
    CollectionInteractComp,
    PageHeaderComp,
    PageIconComp
  ],
  host: { class: 'page wide' }
})
export class OverviewComp {
  private readonly _lStore = inject(LearnablesStore)
  private readonly _facade = inject(OverviewPageFacade)

  // Component state management
  protected readonly bank = this._lStore.activeBank
  readonly collections = computed(() => this.bank().collections)
  readonly learnables = computed(() => this.bank().learnables)
  private readonly _filter = signal<LearnablesFilterConfig | null>(null)

  readonly selectedCollectionId = linkedSignal<CollectionUser[], string | null>(
    {
      source: this.collections,
      computation: (collections, previous) => {
        const previousId = previous?.value
        if (!previousId) return null
        const stillExists = collections.some((c) => c.id === previousId)
        return stillExists ? previousId : null
      }
    }
  )

  readonly selectedCollection = computed<CollectionUser | null>(
    () =>
      this.collections().find((c) => c.id === this.selectedCollectionId()) ??
      null
  )

  // resets selectedLearnableSelection when selected collectionID changes
  readonly selectedLearnableIds = linkedSignal<CollectionUser | null, string[]>(
    {
      source: this.selectedCollection,
      computation: () => []
    }
  )

  readonly unsortedCards = computed(() => {
    const allCollectionCardIds = new Set(
      this.collections().flatMap((c) => c.cardIds)
    )
    return this.learnables().filter((l) => !allCollectionCardIds.has(l.id))
  })

  private readonly _newestIds = computed(() =>
    filterLearnables(this.learnables(), { age: 'newest' }).map((l) => l.id)
  )

  private readonly _collectionLearnables = computed(() => {
    const collection = this.selectedCollection()
    if (!collection) return this.learnables()

    return this.learnables().filter((l) => collection.cardIds.includes(l.id))
  })

  readonly visibleLearnables = computed(() => {
    const filter = this._filter()
    const learnables = this._collectionLearnables()

    if (!filter) return learnables

    return filterLearnables(learnables, filter)
  })

  readonly headerConfig = computed(() => {
    const coll = this.selectedCollection()

    if (coll) {
      return {
        header: coll.name,
        cardCount: this._collectionLearnables().length,
        averageConfidence: calculateAverageConfidencePercent(
          this._collectionLearnables()
        ),
        date: 'created' in coll ? coll.created : undefined
      }
    }
    return {
      header: 'All Cards',
      cardCount: this.learnables().length,
      averageConfidence: calculateAverageConfidencePercent(this.learnables())
    }
  })

  readonly collectionIsEmpty = computed(
    () => this._collectionLearnables().length === 0
  )

  readonly userHasCards = computed(() => this._lStore.learnables().length !== 0)

  readonly collectionDownload = computed(() =>
    this._facade.createDownloadableExport(
      this.bank(),
      this.selectedCollection()?.id
    )
  )

  // View event handlers - delegate to facade

  async addNew() {
    const cardsAdded = await this._facade.openAddLearnablesModal(
      this.selectedCollection(),
      this.bank().language
    )

    if (cardsAdded) {
      this.selectNewest()
    }
  }

  async bulkEdit() {
    await this._facade.openBulkEditModal(
      this.selectedLearnableIds(),
      this.selectedCollection()
    )
  }

  updateFilter(filter: LearnablesFilterFormType) {
    this._filter.set(filter)
  }

  addVisibleToSelection() {
    const visibleLearnableIDs = this.visibleLearnables().map((l) => l.id)

    const newSelectionIDs = removeDuplicates([
      ...visibleLearnableIDs,
      ...this.selectedLearnableIds()
    ])

    this.selectedLearnableIds.set(newSelectionIDs)
  }

  resetLearnableSelection() {
    this.selectedLearnableIds.set([])
  }

  toggleLearnableSelection(lId: string) {
    if (this.selectedLearnableIds().includes(lId)) {
      this.selectedLearnableIds.update((s) => s.filter((id) => id !== lId))
    } else {
      this.selectedLearnableIds.update((s) => [...s, lId])
    }
  }

  isSelected(lId: string): boolean {
    return this.selectedLearnableIds().includes(lId)
  }

  isLastAdded(lId: string): boolean {
    return this._newestIds().includes(lId)
  }

  selectNewest() {
    this.selectedLearnableIds.set(this._newestIds())
  }

  async addToCollection() {
    await this._facade.openAddToCollectionModal(this.selectedLearnableIds())
    this.selectedLearnableIds.set([])
  }

  async removeSelectionFromCollection() {
    const collectionId = this.selectedCollection()?.id
    if (!collectionId) return

    this._facade.removeLearnablesFromCollection(
      collectionId,
      this.selectedLearnableIds()
    )
    this.selectedLearnableIds.set([])
  }

  async deleteSelection() {
    await this._facade.confirmAndDeleteLearnables(this.selectedLearnableIds())
    this.selectedLearnableIds.set([])
  }

  async renameCollection() {
    const collection = this.selectedCollection()
    if (!collection) return

    await this._facade.openRenameCollectionModal(collection)
  }

  async deleteCollection() {
    const collection = this.selectedCollection()
    if (!collection) return

    await this._facade.openDeleteCollectionModal(collection)
  }

  async shareCollection() {
    const collectionId = this.selectedCollection()?.id
    if (!collectionId) return

    await this._facade.openShareCollectionModal(this.bank(), collectionId)
  }
}
