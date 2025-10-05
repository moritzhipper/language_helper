import { Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { config } from '../../../../config'
import { BlobService } from '../../../services/blob-service'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { LearnableUserCollection } from '../../../types_and_schemas/types'
import { ConfirmCollectionDeletionType } from '../../shared/forms/delete-collection-comp/delete-collection-comp'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
import { CollectionComp } from './collection-comp/collection-comp'

@Component({
  selector: 'app-collections-page-comp',
  imports: [PageWrapperComp, IconComp, CollectionComp, RouterLink],
  templateUrl: './collections-page-comp.html',
  styleUrl: './collections-page-comp.scss'
})
export class CollectionsPageComp {
  private readonly _lState = inject(LearnablesStore)
  private readonly _toastS = inject(ToastService)
  private readonly _makeBlobS = inject(BlobService)
  private readonly _modalService = inject(ModalService)

  acceptSuffix = '.' + config.fileExportSuffix

  collections = this._lState.collections
  selectedCollectionId = signal<string | null>(null)
  selectedCollection = computed(() =>
    this.collections().find((c) => c.id === this.selectedCollectionId())
  )

  collectionDownload = computed(() => {
    const collection = this.selectedCollection()
    if (!collection) return null

    return this._makeBlobS.createDownloadableFromLearnables(
      collection.name,
      this._lState.learnables(),
      [collection],
      true
    )
  })

  select(id: string | null) {
    if (id === this.selectedCollectionId()) {
      this.selectedCollectionId.set(null)
    } else {
      this.selectedCollectionId.set(id)
    }
  }

  async deleteCollection(coll: LearnableUserCollection) {
    const result =
      await this._modalService.open<ConfirmCollectionDeletionType>(
        'collection-delete'
      )
    if (result.type !== 'confirm') return

    const removeCardsCompletely = result.value.deletionType === 'remove'
    this._lState.deleteCollection(coll.id, removeCardsCompletely)
    this.selectedCollectionId.set(null)

    this._toastS.showToast({
      type: 'info',
      message: `Collection ${coll.name} deleted`
    })
  }

  async renameCollection(coll: LearnableUserCollection) {
    const result = await this._modalService.open<string>('collection-rename', {
      name: coll.name
    })
    if (result.type !== 'confirm') return

    this._lState.editCollection(coll.id, result.value)
    this.selectedCollectionId.set(null)
  }

  // move to share page
  async importCollection(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return
    const file = input.files[0]

    try {
      const storeExport = await this._makeBlobS.readFile(file)
      const result = await this._modalService.open('collection-import', {
        storeExport
      })

      if (result.type !== 'confirm') return

      this._lState.importExportedCollections(storeExport)
      this._toastS.showToast({
        type: 'info',
        message: `${storeExport.learnables.length} cards imported`
      })
    } catch (e) {
      this._toastS.showToast({
        type: 'error',
        message: (e as Error).message
      })
    }
  }
}
