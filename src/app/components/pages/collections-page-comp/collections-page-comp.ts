import { Component, computed, inject, signal, viewChild } from '@angular/core'
import { ImportExportService } from '../../../services/import-export-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { ConfirmFormComp } from '../../shared/confirm-form-comp/confirm-form-comp'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { ModalWrapperComp } from '../../shared/modal-wrapper-comp/modal-wrapper-comp'
import { PageWrapperComp } from '../page-wrapper-comp/page-wrapper-comp'
import { CollectionComp } from './collection-comp/collection-comp'
import { EditCollectionComp } from './edit-collection-comp/edit-collection-comp'

@Component({
  selector: 'app-collections-page-comp',
  imports: [
    PageWrapperComp,
    IconComp,
    ModalWrapperComp,
    ConfirmFormComp,
    EditCollectionComp,
    CollectionComp
  ],
  templateUrl: './collections-page-comp.html',
  styleUrl: './collections-page-comp.scss'
})
export class CollectionsPageComp {
  private readonly _lState = inject(LearnablesStore)
  private readonly _makeBlobS = inject(ImportExportService)

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

  collectionDownload = computed(() => {
    const collection = this.selectedCollection()
    if (!collection) return null
    console.log({ collection })

    return this._makeBlobS.createDownloadableFromLearnables(
      this._lState.getExportableCollections(collection.id),
      collection.name
    )
  })

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

  calcAvgGuesses(id: string): number {
    const collection = this.collections().find((c) => c.id === id)
    if (!collection) return 0

    const learnables = this._lState
      .learnables()
      .filter((l) => collection.learnableIDs.includes(l.id))

    const allGuesses = learnables.flatMap((l) => [
      ...l.guesses.lexeme,
      ...l.guesses.translation
    ])

    const trueGuesses = allGuesses.filter(Boolean).length
    const confidencePercent = trueGuesses / allGuesses.length

    return Math.round(confidencePercent * 100)
  }
}
