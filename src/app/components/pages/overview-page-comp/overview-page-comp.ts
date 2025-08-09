import { Component, computed, inject, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import {
  Learnable,
  LearnableBase,
  LearnablesFilterConfig
} from '../../../types_and_schemas/types'
import { filterDoubleEntries } from '../../../utils/import-export-utils'
import { filterLearnables } from '../../../utils/learnables-filter'
import { ConfirmationType } from '../../shared/forms/bulk-add-comp/bulk-edit-comp'
import { ConfirmCollectionAddType } from '../../shared/forms/collection-add-comp/collection-add-comp'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
import {
  FilterFormComp,
  LearnablesFilterFormType
} from './filter-form-comp/filter-form-comp'
import { LearnableComp } from './learnable-comp/learnable-comp'

@Component({
  selector: 'app-overview',
  templateUrl: './overview-page-comp.html',
  styleUrl: './overview-page-comp.scss',
  imports: [
    ReactiveFormsModule,
    LearnableComp,
    PageWrapperComp,
    IconComp,
    FilterFormComp
  ]
})
export class OverviewComp {
  private readonly _lStore = inject(LearnablesStore)
  private readonly _toastService = inject(ToastService)
  private readonly _modalService = inject(ModalService)

  private _learnablesInSelectedCollection = computed(() => {
    const learnables = this._lStore.learnables()
    const selectCollection = this.collections().find(
      (c) => c.id === this.selectedCollectionId()
    )
    if (!selectCollection) return learnables

    return selectCollection.learnableIDs
      .map((lId) => learnables.find((l) => l.id === lId))
      .filter(Boolean) as Learnable[]
  })

  collectionHasCards = computed(
    () => this._learnablesInSelectedCollection().length !== 0
  )

  userHasCards = computed(() => this._lStore.learnables().length !== 0)

  collections = this._lStore.collections
  selectedCollectionId = signal<string | null>(null)

  // learnables after filtering
  private filter = signal<LearnablesFilterConfig | null>(null)
  selectedLearnableIds = signal<string[]>([])

  visibleLearnables = computed(() => {
    const filter = this.filter()
    const learnables = this._learnablesInSelectedCollection()
    if (!filter) return learnables

    return filterLearnables(this._learnablesInSelectedCollection(), filter)
  })

  private _latestIDs = computed(() => {
    const latestLearnableIDs = filterLearnables(this._lStore.learnables(), {
      age: 'newest'
    }).map((l) => l.id)
    return latestLearnableIDs
  })

  async addNew() {
    const result = await this._modalService.open<LearnableBase[]>('magic-add')

    if (result.type !== 'confirm') return
    this._addAndMarkLearnables(result.value)
  }

  async bulkEdit() {
    const learnables = this._learnablesInSelectedCollection().filter((l) =>
      this.selectedLearnableIds().includes(l.id)
    )

    const result = await this._modalService.open<ConfirmationType>(
      'bulk-edit',
      { learnables }
    )

    if (result.type !== 'confirm') return
    const { update, deleteIDs, add } = result.value
    this._lStore.updateLearnables(update)
    this._lStore.removeLearnables(deleteIDs)
    this._addAndMarkLearnables(add)
  }

  resetLearnableSelection() {
    this.selectedLearnableIds.set([])
  }

  async addToCollection() {
    const result = await this._modalService.open<ConfirmCollectionAddType>(
      'collection-add',
      { collections: this.collections() }
    )

    if (result.type !== 'confirm') return

    const { createName, addToId } = result.value
    const selectedIDs = this.selectedLearnableIds()

    if (createName) {
      this._lStore.createCollection(createName, selectedIDs)
    }
    if (addToId) {
      this._lStore.editCollectionLearnables(addToId, selectedIDs, [])
    }

    const collectionName =
      createName || this.collections().find((c) => c.id === addToId)?.name

    this._toastService.showToast({
      message: `Added ${selectedIDs.length} cards to ${collectionName}`,
      type: 'info'
    })
    this.selectedLearnableIds.set([])
  }

  async removeSelectionFromCollection() {
    const collectionId = this.selectedCollectionId()
    if (!collectionId) return
    this._lStore.editCollectionLearnables(
      collectionId,
      [],
      [...this.selectedLearnableIds()]
    )
  }

  async removeSelection() {
    const deleteCardsAmount = this.selectedLearnableIds().length
    const message =
      deleteCardsAmount === 1
        ? `Are you sure you want to delete this card?`
        : `Are you sure you want to delete ${deleteCardsAmount} cards?`

    const confirm = await this._modalService.open<ConfirmationType>('confirm', {
      message
    })

    if (confirm.type !== 'confirm') return
    this._lStore.removeLearnables(this.selectedLearnableIds())
    this.selectedLearnableIds.set([])

    this._toastService.showToast({
      message: `Removed ${deleteCardsAmount} cards`,
      type: 'info'
    })
  }

  private _addAndMarkLearnables(learnables: LearnableBase[]) {
    if (learnables.length === 0) return
    const existingLearnables = this._lStore.learnables()

    const uniqueLearnables = filterDoubleEntries(
      learnables,
      this._lStore.learnables()
    )

    this._lStore.addLearnables(uniqueLearnables)
    this.selectedLearnableIds.set(this._latestIDs())

    // add to collection, if user has one selected
    const collectionId = this.selectedCollectionId()
    if (collectionId) {
      this._lStore.editCollectionLearnables(collectionId, this._latestIDs(), [])
    }

    this._toastService.showToast({
      message: `created ${uniqueLearnables.length} cards.`,
      type: 'info'
    })

    // show skipped reminder, when user tried creating one that already exists
    const filteredLearnablesCount = learnables.length - uniqueLearnables.length
    if (filteredLearnablesCount !== 0) {
      this._toastService.showToast({
        message: `skipped adding ${filteredLearnablesCount} duplicates`,
        type: 'info'
      })
    }
  }

  isLastAdded(lId: string): boolean {
    return this._latestIDs().includes(lId)
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

  updateFilter(filter: LearnablesFilterFormType) {
    const filterConfig: LearnablesFilterConfig = {
      type: filter.type,
      confidence: filter.confidence,
      orderBy: filter.orderBy,
      order: filter.order,
      age: filter.age,
      search: filter.search
    }

    this.filter.set(filterConfig)
  }

  selectCollection(collectionId: string | null) {
    if (collectionId !== this.selectedCollectionId()) {
      this.selectedLearnableIds.set([])
    }
    this.selectedCollectionId.set(collectionId)
  }
}
