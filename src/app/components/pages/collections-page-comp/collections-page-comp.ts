import { Component, computed, inject, signal, viewChild } from '@angular/core'
import { LearnablesStore } from '../../../store/learnablesStore'
import { ConfirmFormComp } from '../../shared/confirm-form-comp/confirm-form-comp'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { ModalWrapperComp } from '../../shared/modal-wrapper-comp/modal-wrapper-comp'
import { PageWrapperComp } from '../page-wrapper-comp/page-wrapper-comp'
import { EditCollectionComp } from './edit-collection-comp/edit-collection-comp'

@Component({
  selector: 'app-collections-page-comp',
  imports: [
    PageWrapperComp,
    IconComp,
    ModalWrapperComp,
    ConfirmFormComp,
    EditCollectionComp
  ],
  templateUrl: './collections-page-comp.html',
  styleUrl: './collections-page-comp.scss'
})
export class CollectionsPageComp {
  private readonly _lState = inject(LearnablesStore)

  private deleteCollectionModal = viewChild.required<ModalWrapperComp>(
    'deleteCollectionModal'
  )
  private renameCollectionModal = viewChild.required<ModalWrapperComp>(
    'renameCollectionModal'
  )
  collections = this._lState.collections
  selectedCollectionId = signal<string | null>(null)
  selectedCollection = computed(() =>
    this.collections().find((c) => c.id === this.selectedCollectionId())
  )

  select(id: string | null) {
    if (id === this.selectedCollectionId()) {
      this.selectedCollectionId.set(null)
    } else {
      this.selectedCollectionId.set(id)
    }
  }

  deleteCollection() {
    const collectionId = this.selectedCollectionId()
    if (!collectionId) return
    this._lState.deleteCollection(collectionId)
    this.selectedCollectionId.set(null)
    this.deleteCollectionModal().close()
  }

  renameCollection(name: string) {
    const collectionId = this.selectedCollectionId()
    if (!collectionId) return
    this._lState.editCollection(collectionId, name)
    this.selectedCollectionId.set(null)
    this.renameCollectionModal().close()
  }
}
