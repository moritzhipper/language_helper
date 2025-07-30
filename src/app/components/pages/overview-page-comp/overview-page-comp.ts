import { Component, computed, inject, signal, viewChild } from '@angular/core'
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
import { ConfirmCollectionAddType } from '../../shared/forms/collection-add-comp/collection-add-comp'
import { ModalWrapperComp } from '../../shared/forms/modal-wrapper-comp/modal-wrapper-comp'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
import { ConfirmationType } from './bulk-add-comp/bulk-edit-comp'
import { FilterFormComp } from './filter-form-comp/filter-form-comp'
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
    ModalWrapperComp,
    FilterFormComp
  ]
})
export class OverviewComp {
  private readonly addModal = viewChild.required<ModalWrapperComp>('addModal')
  private readonly deleteModal =
    viewChild.required<ModalWrapperComp>('deleteModal')
  private readonly bulkEditModal =
    viewChild.required<ModalWrapperComp>('bulkEditModal')
  private readonly collectionAddModal =
    viewChild.required<ModalWrapperComp>('collectionAddModal')

  private readonly _lStore = inject(LearnablesStore)
  private readonly _toastService = inject(ToastService)
  private readonly _modalService = inject(ModalService)

  private _learnables = computed(() => {
    const learnables = this._lStore.learnables()
    const selectCollection = this.collections().find(
      (c) => c.id === this.selectedCollectionId()
    )
    if (!selectCollection) return learnables

    return selectCollection.learnableIDs
      .map((lId) => learnables.find((l) => l.id === lId))
      .filter(Boolean) as Learnable[]
  })

  cardsVisible = computed(() => this._learnables().length !== 0)

  collections = this._lStore.collections
  selectedCollectionId = signal<string | null>(null)

  private filter = signal<LearnablesFilterConfig | null>(null)

  selectedLearnableIds = signal<string[]>([])

  selectedLearnables = computed(() =>
    this._learnables().filter((l) => this.selectedLearnableIds().includes(l.id))
  )

  learnableWordsLexemes = computed(() =>
    this._learnables()
      .filter((l) => l.type === 'word')
      .map((l) => l.lexeme)
  )

  filteredLearnables = computed(() => {
    const filter = this.filter()
    const learnables = this._learnables()
    if (!filter) return learnables

    return filterLearnables(this._learnables(), filter)
  })

  async addNew() {
    const result = await this._modalService.open<LearnableBase[]>('magic-add')

    if (result.type !== 'confirm') return
    this._addAndMarkLearnables(result.value)
  }

  resetLearnableSelection() {
    this.selectedLearnableIds.set([])
  }

  async addCollection() {
    const result =
      await this._modalService.open<ConfirmCollectionAddType>('collection-add')

    if (result.type !== 'confirm') return
    this.confirmCollectionAdd(result.value)
  }

  confirmCollectionAdd({ createName, addToId }: ConfirmCollectionAddType) {
    const selectedIDs = this.selectedLearnableIds()
    if (createName) {
      this._lStore.createCollection(createName, selectedIDs)
    }
    if (addToId) {
      this._lStore.editCollectionLearnables(addToId, selectedIDs, [])
    }
    this.selectedLearnableIds.set([])
    this.collectionAddModal().close()
  }

  async removeSelectionFromCollection() {
    // Now res is typed as Learnable[] specifically
    const collectionId = this.selectedCollectionId()
    if (!collectionId) return
    this._lStore.editCollectionLearnables(
      collectionId,
      [],
      [...this.selectedLearnableIds()]
    )
  }

  confirmEdit(conf: ConfirmationType) {
    this._lStore.updateLearnables(conf.update)
    this._lStore.removeLearnables(conf.deleteIDs)
    this._addAndMarkLearnables(conf.add)
    this.bulkEditModal().close()
  }

  private _addAndMarkLearnables(learnables: LearnableBase[]) {
    const existingLearnables = this._lStore.learnables()

    const uniqueLearnables = filterDoubleEntries(
      learnables,
      this._lStore.learnables()
    )
    const filteredLearnablesCount = learnables.length - uniqueLearnables.length

    this._toastService.showToast({
      message: `Created ${uniqueLearnables.length} cards!`,
      type: 'info'
    })

    if (filteredLearnablesCount > 0) {
      this._toastService.showToast({
        message: `Skipped adding ${filteredLearnablesCount} because you already have those!`,
        type: 'info'
      })
    }

    this._lStore.addLearnables(learnables)
    this.selectedLearnableIds.set(this._lStore.addedLatestIDs())
    const collectionId = this.selectedCollectionId()
    if (collectionId) {
      this._lStore.editCollectionLearnables(
        collectionId,
        this._lStore.addedLatestIDs(),
        []
      )
    }
  }

  confirmDelete() {
    this.deleteModal().close()
    this._lStore.removeLearnables(this.selectedLearnableIds())
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

  updateFilter(filter: LearnablesFilterConfig) {
    this.filter.set(filter)
  }

  selectCollection(collectionId: string | null) {
    if (collectionId !== this.selectedCollectionId()) {
      this.selectedLearnableIds.set([])
    }
    this.selectedCollectionId.set(collectionId)
  }
}
