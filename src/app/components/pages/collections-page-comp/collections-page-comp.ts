import { Component, computed, inject, signal } from '@angular/core'
import { config } from '../../../../config'
import { BlobService } from '../../../services/blob-service'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { LearnableCollection } from '../../../types_and_schemas/types'
import {
  parseFileImportString,
  verifiyImportedFileValidity
} from '../../../utils/import-export-utils'
import { ConfirmCollectionDeletionType } from '../../shared/forms/delete-collection-comp/delete-collection-comp'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
import { CollectionComp } from './collection-comp/collection-comp'

@Component({
  selector: 'app-collections-page-comp',
  imports: [PageWrapperComp, IconComp, CollectionComp],
  templateUrl: './collections-page-comp.html',
  styleUrl: './collections-page-comp.scss'
})
export class CollectionsPageComp {
  private readonly _lState = inject(LearnablesStore)
  private readonly _toastS = inject(ToastService)
  private readonly _makeBlobS = inject(BlobService)
  private readonly _modalService = inject(ModalService)

  config = config

  private fileReader = new FileReader()

  constructor() {
    this.fileReader.onload = this._fileReaderLoad
  }

  collections = this._lState.collections
  selectedCollectionId = signal<string | null>(null)
  selectedCollection = computed(() =>
    this.collections().find((c) => c.id === this.selectedCollectionId())
  )

  collectionDownload = computed(() => {
    const collection = this.selectedCollection()
    if (!collection) return null

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

  async deleteCollection(coll: LearnableCollection) {
    const result =
      await this._modalService.open<ConfirmCollectionDeletionType>(
        'collection-delete'
      )
    if (result.type !== 'confirm') return

    const removeCardsCompletely = result.value.deletionType === 'remove'
    this._lState.deleteCollection(coll.id, removeCardsCompletely)

    this.selectedCollectionId.set(null)
  }

  async renameCollection(coll: LearnableCollection) {
    const result = await this._modalService.open<string>('collection-rename', {
      name: coll.name
    })
    if (result.type !== 'confirm') return

    this._lState.editCollection(coll.id, result.value)
    this.selectedCollectionId.set(null)
  }

  importCollection(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return
    const file = input.files[0]
    try {
      verifiyImportedFileValidity(file)
      this.fileReader.readAsText(file)
    } catch (e) {
      this._toastS.showToast({
        type: 'error',
        message: (e as Error).message
      })
    }
  }

  private _fileReaderLoad = (e: ProgressEvent<FileReader>) => {
    const content = e.target?.result as string
    try {
      const imported = parseFileImportString(content)

      this._lState.importExportedCollections(imported)
      this._toastS.showToast({
        type: 'info',
        message: `${imported.collections} collections imported!`
      })
    } catch (e) {
      this._toastS.showToast({
        type: 'error',
        message: (e as Error).message
      })
    }
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

    if (allGuesses.length === 0) return 0

    const trueGuesses = allGuesses.filter(Boolean).length
    const confidencePercent = trueGuesses / allGuesses.length

    return Math.round(confidencePercent * 100)
  }
}
