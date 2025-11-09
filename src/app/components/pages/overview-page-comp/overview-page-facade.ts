import { inject, Injectable } from '@angular/core'
import { ApiService } from '../../../services/api-service'
import { BlobService } from '../../../services/blob-service'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import {
  BankUser,
  CollectionUser,
  LanguageConfig,
  LearnableBase
} from '../../../types_and_schemas/types'
import {
  filterDoubleEntries,
  mapToBankExport
} from '../../../utils/import-export-utils'
import { filterLearnables } from '../../../utils/learnables-filter'
import { ConfirmationType } from '../../shared/forms/bulk-add-comp/bulk-edit-comp'
import { ConfirmCollectionAddType } from '../../shared/forms/collection-add-comp/collection-add-comp'
import { ConfirmCollectionDeletionType } from '../../shared/forms/delete-collection-comp/delete-collection-comp'
import { ShareFormResponse } from '../../shared/forms/share-form-comp/share-form-comp'

/**
 * Facade service for the overview page component.
 * Provides stateless methods for business logic and store interactions.
 * Does not hold state - all state is managed in the component.
 */
@Injectable({
  providedIn: 'root'
})
export class OverviewPageFacade {
  private readonly _lStore = inject(LearnablesStore)
  private readonly _apiService = inject(ApiService)
  private readonly _modalService = inject(ModalService)
  private readonly _toastService = inject(ToastService)
  private readonly _blobService = inject(BlobService)

  // Public methods for learnable management

  async addNew(
    selectedCollection: CollectionUser | null,
    language: LanguageConfig
  ): Promise<void> {
    const result = await this._modalService.open<LearnableBase[]>('magic-add', {
      language
    })

    if (result.type !== 'confirm') return

    return this._addLearnables(result.value, selectedCollection)
  }

  async bulkEdit(
    selectedLearnableIds: string[],
    selectedCollection: CollectionUser | null
  ): Promise<void> {
    const learnables = this._lStore
      .learnables()
      .filter((l) => selectedLearnableIds.includes(l.id))

    const result = await this._modalService.open<ConfirmationType>(
      'bulk-edit',
      { learnables }
    )

    if (result.type !== 'confirm') return

    const { update, deleteIDs, add } = result.value
    this._lStore.updateLearnables(update)
    this._lStore.removeLearnables(deleteIDs)

    this._addLearnables(add, selectedCollection)
  }

  async addToCollection(selectedLearnableIds: string[]) {
    const result = await this._modalService.open<ConfirmCollectionAddType>(
      'collection-add',
      { collections: this._lStore.collections() }
    )

    if (result.type !== 'confirm') return

    const { createName, addToId } = result.value

    if (createName) {
      this._lStore.createCollection(createName, selectedLearnableIds)
    }

    if (addToId) {
      this._lStore.editCollectionLearnables(addToId, selectedLearnableIds, [])
    }

    const collectionName =
      createName ||
      this._lStore.collections().find((c) => c.id === addToId)?.name

    this._toastService.showToast({
      message: `Added ${selectedLearnableIds.length} cards to ${collectionName}`,
      type: 'info'
    })
  }

  removeSelectionFromCollection(
    collectionId: string,
    selectedLearnableIds: string[]
  ) {
    this._lStore.editCollectionLearnables(
      collectionId,
      [],
      [...selectedLearnableIds]
    )

    this._toastService.showToast({
      message: `Removed ${selectedLearnableIds.length} cards from collection`,
      type: 'info'
    })
  }

  async deleteSelection(selectedLearnableIds: string[]) {
    const deleteCardsAmount = selectedLearnableIds.length
    const message =
      deleteCardsAmount === 1
        ? `Are you sure you want to delete this card?`
        : `Are you sure you want to delete ${deleteCardsAmount} cards?`

    const confirm = await this._modalService.open<ConfirmationType>('confirm', {
      message
    })

    if (confirm.type !== 'confirm') return

    this._lStore.removeLearnables(selectedLearnableIds)

    this._toastService.showToast({
      message: `Removed ${deleteCardsAmount} cards`,
      type: 'info'
    })
  }

  async renameCollection(collection: CollectionUser) {
    const result = await this._modalService.open<string>('collection-rename', {
      name: collection.name
    })
    if (result.type !== 'confirm') return

    this._lStore.editCollection(collection.id, result.value)
  }

  async deleteCollection(id: string) {
    const result =
      await this._modalService.open<ConfirmCollectionDeletionType>(
        'collection-delete'
      )
    if (result.type !== 'confirm') return

    const removeCardsCompletely = result.value.deletionType === 'remove'
    this._lStore.deleteCollection(id, removeCardsCompletely)

    this._toastService.showToast({
      type: 'info',
      message: `Collection ${id} deleted`
    })
  }

  async shareCollection(bank: BankUser, id: string) {
    const userChoice = await this._modalService.open<ShareFormResponse>(
      'share-collection',
      {
        bank
      }
    )

    if (userChoice.type !== 'confirm') return
    const bankExport = mapToBankExport('hi', bank, [id])
    await this._apiService.shareBank(bankExport, userChoice.value.ttlMinutes)
  }

  createCollectionDownload(bank: BankUser, id?: string) {
    if (!id) {
      const bankExport = mapToBankExport('hi', bank)
      return this._blobService.createDownloadableFromLearnables(bankExport)
    }

    const bankExport = mapToBankExport('hi', bank, [id])
    return this._blobService.createDownloadableFromLearnables(bankExport)
  }

  // Private helper methods

  private _addLearnables(
    learnables: LearnableBase[],
    selectedCollection: CollectionUser | null
  ): void {
    if (learnables.length === 0) return

    // filter duplicate entries

    const uniqueLearnables = filterDoubleEntries(
      learnables,
      this._lStore.learnables()
    )

    this._lStore.addLearnables(uniqueLearnables)

    const newIds = filterLearnables(this._lStore.learnables(), {
      age: 'newest'
    }).map((l) => l.id)
    // Get the IDs of the newly created learnables

    // Add to collection if user has one selected
    if (selectedCollection) {
      this._lStore.editCollectionLearnables(selectedCollection.id, newIds, [])

      this._toastService.showToast({
        message: `created ${uniqueLearnables.length} cards and added them to collection ${selectedCollection.name}`,
        type: 'info'
      })
    } else {
      this._toastService.showToast({
        message: `created ${uniqueLearnables.length} cards`,
        type: 'info'
      })
    }

    // Show skipped reminder when user tried creating duplicate cards
    const filteredLearnablesCount = learnables.length - uniqueLearnables.length
    if (filteredLearnablesCount !== 0) {
      this._toastService.showToast({
        message: `skipped adding ${filteredLearnablesCount} duplicates`,
        type: 'info'
      })
    }
  }
}
