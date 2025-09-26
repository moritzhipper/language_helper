import { Component, computed, inject, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import {
  LearnableBase,
  LearnablesFilterConfig
} from '../../../types_and_schemas/types'
import { removeDuplicates } from '../../../utils/genaral-utils'
import { filterDoubleEntries } from '../../../utils/import-export-utils'
import { filterLearnables } from '../../../utils/learnables-filter'
import { ConfirmationType } from '../../shared/forms/bulk-add-comp/bulk-edit-comp'
import { ConfirmCollectionAddType } from '../../shared/forms/collection-add-comp/collection-add-comp'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
import { CollectionInfoComp } from './collection-info-comp/collection-info-comp'
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
    FilterFormComp
  ]
})
export class OverviewComp {
  private readonly _lStore = inject(LearnablesStore)
  private readonly _toastService = inject(ToastService)
  private readonly _modalService = inject(ModalService)

  pseudoCollections = this._lStore.pseudoCollections
  nonPseudoCollectionIsSelected = computed(() =>
    this._lStore.collections().some((c) => c.id === this.selectedCollectionId())
  )

  collectionIsEmpty = computed(
    () => this.selectedCollection().learnableIDs.length === 0
  )

  userHasCards = computed(() => this._lStore.learnables().length !== 0)
  collections = this._lStore.collections

  private filter = signal<LearnablesFilterConfig | null>(null)

  selectedCollectionId = signal<string>(this.pseudoCollections()[0].id)

  selectedCollection = computed(() => {
    const collections = [
      ...this._lStore.collections(),
      ...this._lStore.pseudoCollections()
    ]

    return (
      collections.find((c) => c.id === this.selectedCollectionId()) ??
      this.pseudoCollections()[0]
    )
  })

  // learnables after filtering
  visibleLearnables = computed(() => {
    const filter = this.filter()
    const learnables = this._lStore
      .learnables()
      .filter((l) => this.selectedCollection().learnableIDs.includes(l.id))

    if (!filter) return learnables

    return filterLearnables(learnables, filter)
  })

  selectedLearnableIds = signal<string[]>([])

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

    this.selectDefaultColIfPseudoEmpty()
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

    this.selectDefaultColIfPseudoEmpty()
    this._finishEditAndShowToast(
      `Added ${selectedIDs.length} cards to ${collectionName}`
    )
  }

  async removeSelectionFromCollection() {
    const selectedIDs = this.selectedLearnableIds()
    this._lStore.editCollectionLearnables(
      this.selectedCollectionId(),
      [],
      [...selectedIDs]
    )
    this._finishEditAndShowToast(
      `Removed ${selectedIDs.length} cards from collection`
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
    this.selectDefaultColIfPseudoEmpty()
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
    if (this.nonPseudoCollectionIsSelected()) {
      this._lStore.editCollectionLearnables(
        this.selectedCollectionId(),
        this._latestIDs(),
        []
      )
    }

    this._toastService.showToast({
      message: `created ${uniqueLearnables.length} cards`,
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
    this.filter.set(filter)
  }

  onCollectionChange(event: Event) {
    const selection = (event.target as HTMLSelectElement).value
    this.selectedCollectionId.set(selection)
    this.selectedLearnableIds.set([])
  }

  selectDefaultColIfPseudoEmpty() {
    if (
      !this.nonPseudoCollectionIsSelected() &&
      this.selectedCollection().learnableIDs.length === 0
    ) {
      this.selectedCollectionId.set(this.pseudoCollections()[0].id)
    }
  }
}
