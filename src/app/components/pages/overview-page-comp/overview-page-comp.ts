import { Component, computed, inject, signal, viewChild } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { LearnablesStore } from '../../../store/learnablesStore'
import {
  Learnable,
  LearnableBase,
  LearnablesFilterConfig
} from '../../../types_and_schemas/types'
import { filterLearnables } from '../../../utils/learnables-filter'
import { ConfirmFormComp } from '../../shared/confirm-form-comp/confirm-form-comp'
import { CounterComp } from '../../shared/counter-comp/counter-comp'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { ModalWrapperComp } from '../../shared/modal-wrapper-comp/modal-wrapper-comp'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
import { BulkEditComp, ConfirmationType } from './bulk-add-comp/bulk-edit-comp'
import {
  CollectionAddComp,
  ConfirmCollectionAddType
} from './collection-add-comp/collection-add-comp'
import { FilterFormComp } from './filter-form-comp/filter-form-comp'
import { LearnableComp } from './learnable-comp/learnable-comp'
import { MagicAddComp } from './magic-add-comp/magic-add-comp'

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
    MagicAddComp,
    BulkEditComp,
    ConfirmFormComp,
    CounterComp,
    FilterFormComp,
    CollectionAddComp
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

  collections = this._lStore.collections
  selectedCollectionId = signal<string | null>(null)

  private filter = signal<LearnablesFilterConfig | null>(null)

  selectedLearnableIds = signal<string[]>([])

  selectedLearnables = computed(() =>
    this._learnables().filter((l) => this.selectedLearnableIds().includes(l.id))
  )

  learnableLexemes = computed(() =>
    this.selectedLearnables().map((l) => l.lexeme)
  )

  filteredLearnables = computed(() => {
    const filter = this.filter()
    const learnables = this._learnables()
    if (!filter) return learnables

    return filterLearnables(this._learnables(), filter)
  })

  resetLearnableSelection() {
    this.selectedLearnableIds.set([])
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

  removeSelectionFromCollection() {
    const collectionId = this.selectedCollectionId()
    if (!collectionId) return
    this._lStore.editCollectionLearnables(
      collectionId,
      [],
      [...this.selectedLearnableIds()]
    )
  }

  confirmAdd(learnables: LearnableBase[]) {
    const learnablesLengthBeforeAdd = this._lStore.learnables().length

    // save new learnables to the store
    this._addAndMarkLearnables(learnables)
    this.addModal().close()
  }

  confirmEdit(conf: ConfirmationType) {
    this._lStore.updateLearnables(conf.update)
    this._lStore.removeLearnables(conf.deleteIDs)
    this._addAndMarkLearnables(conf.add)
    this.bulkEditModal().close()
  }

  private _addAndMarkLearnables(learnables: LearnableBase[]) {
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
