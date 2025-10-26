import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ApiService } from '../../../services/api-service'
import { BlobService } from '../../../services/blob-service'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import {
  LearnableBase,
  LearnablesFilterConfig
} from '../../../types_and_schemas/types'
import {
  calculateAverageConfidencePercent,
  removeDuplicates
} from '../../../utils/genaral-utils'
import {
  filterDoubleEntries,
  mapToBankExport
} from '../../../utils/import-export-utils'
import { filterLearnables } from '../../../utils/learnables-filter'
import { ConfirmationType } from '../../shared/forms/bulk-add-comp/bulk-edit-comp'
import { ConfirmCollectionAddType } from '../../shared/forms/collection-add-comp/collection-add-comp'
import { ConfirmCollectionDeletionType } from '../../shared/forms/delete-collection-comp/delete-collection-comp'
import { ShareFormResponse } from '../../shared/forms/share-form-comp/share-form-comp'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
import { CollectionInfoComp } from './collection-info-comp/collection-info-comp'
import { CollectionInteractComp } from './collection-interact-comp/collection-interact-comp'
import { EditBubblesComp } from './edit-bubbles-comp/edit-bubbles-comp'
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
    CollectionInfoComp,
    ReactiveFormsModule,
    LearnableComp,
    PageWrapperComp,
    IconComp,
    FilterFormComp,
    FormsModule,
    EditBubblesComp,
    CollectionInteractComp
  ]
})
export class OverviewComp {
  private readonly _lStore = inject(LearnablesStore)
  private readonly _toastService = inject(ToastService)
  private readonly _modalService = inject(ModalService)
  private readonly _makeBlobS = inject(BlobService)
  private readonly _apiService = inject(ApiService)

  collections = this._lStore.collections

  collectionIsEmpty = computed(() => this._collectionLearnables().length === 0)

  userHasCards = computed(() => this._lStore.learnables().length !== 0)

  private _filter = signal<LearnablesFilterConfig | null>(null)

  selectedCollection = computed(() =>
    this.collections().find((c) => c.id === this.selectedCollectionId())
  )

  headerConfig = computed(() => {
    const coll = this.selectedCollection()

    if (coll) {
      return {
        header: coll.name,
        cardCount: coll.learnableIDs.length,
        averageConfidence: calculateAverageConfidencePercent(
          this._collectionLearnables()
        ),
        date: 'created' in coll ? coll.created : undefined
      }
    }
    return {
      header: 'All Cards',
      cardCount: this._lStore.learnables().length,
      averageConfidence: calculateAverageConfidencePercent(
        this._lStore.learnables()
      )
    }
  })

  selectedCollectionId = signal<string | null>(null)

  selectCollectionById(id: string) {
    this.selectedCollectionId.set(id)
  }

  private _collectionLearnables = computed(() =>
    this._lStore
      .learnables()
      .filter(
        (l) => this.selectedCollection()?.learnableIDs.includes(l.id) ?? true
      )
  )

  // learnables after filtering
  visibleLearnables = computed(() => {
    const filter = this._filter()
    const learnables = this._collectionLearnables()

    if (!filter) return learnables

    return filterLearnables(learnables, filter)
  })

  selectedLearnableIds = linkedSignal<string | null, string[]>({
    source: this.selectedCollectionId,
    computation: () => []
  })

  addVisibleToSelection() {
    const visibleLearnableIDs = this.visibleLearnables().map((l) => l.id)

    const newSelectionIDs = removeDuplicates([
      ...visibleLearnableIDs,
      ...this.selectedLearnableIds()
    ])

    this.selectedLearnableIds.set(newSelectionIDs)
  }

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
    const learnables = this._lStore
      .learnables()
      .filter((l) => this.selectedLearnableIds().includes(l.id))

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

    this._finishEditAndShowToast(
      `Added ${selectedIDs.length} cards to ${collectionName}`
    )
  }

  async removeSelectionFromCollection() {
    const selectedIDs = this.selectedLearnableIds()
    const collectionId = this.selectedCollectionId()
    if (!collectionId) return

    this._lStore.editCollectionLearnables(collectionId, [], [...selectedIDs])
    this._finishEditAndShowToast(
      `Removed ${selectedIDs.length} cards from collection`
    )
  }

  async deleteSelection() {
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
    this._finishEditAndShowToast(`Removed ${deleteCardsAmount} cards`)
  }

  private _finishEditAndShowToast(message: string) {
    this.selectedLearnableIds.set([])
    this._toastService.showToast({ message, type: 'info' })
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

    // add to collection, if user has one selected that is not a pseudo collection
    const collection = this.selectedCollection()
    if (collection) {
      this._lStore.editCollectionLearnables(
        collection.id,
        this._latestIDs(),
        []
      )

      this._toastService.showToast({
        message: `created ${uniqueLearnables.length} cards and added them to collection ${collection.name}`,
        type: 'info'
      })
    } else {
      this._toastService.showToast({
        message: `created ${uniqueLearnables.length} cards`,
        type: 'info'
      })
    }

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
    this._filter.set(filter)
  }

  async renameCollection() {
    const collection = this.selectedCollection()

    if (!collection) return

    const coll = this.selectedCollection()

    const result = await this._modalService.open<string>('collection-rename', {
      name: collection.name
    })
    if (result.type !== 'confirm') return

    this._lStore.editCollection(collection.id, result.value)
  }

  async deleteCollection() {
    const coll = this.selectedCollection()
    if (!coll) return

    const result =
      await this._modalService.open<ConfirmCollectionDeletionType>(
        'collection-delete'
      )
    if (result.type !== 'confirm') return

    const removeCardsCompletely = result.value.deletionType === 'remove'
    this._lStore.deleteCollection(coll.id, removeCardsCompletely)

    this._toastService.showToast({
      type: 'info',
      message: `Collection ${coll.name} deleted`
    })
  }

  async shareCollection() {
    const collection = this.selectedCollection()
    if (!collection) return

    const userChoice = await this._modalService.open<ShareFormResponse>(
      'share-collection',
      {
        collection
      }
    )

    if (userChoice.type !== 'confirm') return

    const bankExport = mapToBankExport(
      collection.name,
      this._lStore.learnables(),
      [collection],
      true
    )

    const shareUrl = await this._apiService.shareBank(
      bankExport,
      userChoice.value.ttlMinutes
    )
  }

  collectionDownload = computed(() => {
    const collection = this.selectedCollection()
    if (!collection) return null

    return this._makeBlobS.createDownloadableFromLearnables(
      collection.name,
      this._lStore.learnables(),
      [collection],
      true
    )
  })
}
