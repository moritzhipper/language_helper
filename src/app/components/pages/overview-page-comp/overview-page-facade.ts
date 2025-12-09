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
import { mapToBankExport } from '../../../utils/import-export-utils'
import { filterLearnables } from '../../../utils/learnables-filter'
import { ConfirmationType } from '../../shared/forms/bulk-add-comp/bulk-edit-comp'
import { ConfirmCollectionAddType } from '../../shared/forms/collection-add-comp/collection-add-comp'
import { ConfirmCollectionDeletionType } from '../../shared/forms/delete-collection-comp/delete-collection-comp'
import { ModalResult } from '../../shared/forms/modal-config'
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
  private readonly store = inject(LearnablesStore)
  private readonly apiService = inject(ApiService)
  private readonly modalService = inject(ModalService)
  private readonly toastService = inject(ToastService)
  private readonly blobService = inject(BlobService)

  // ─────────────────────────────────────────────────────────────────────────────
  // Learnable Operations
  // ─────────────────────────────────────────────────────────────────────────────

  async openAddLearnablesModal(
    selectedCollection: CollectionUser | null,
    language: LanguageConfig
  ): Promise<boolean> {
    const result = await this.modalService.open<LearnableBase[]>('magic-add', {
      language
    })

    if (!this.isConfirmed(result)) return false

    return this.addLearnablesToStore(result.value, selectedCollection)
  }

  async openBulkEditModal(
    selectedLearnableIds: string[],
    selectedCollection: CollectionUser | null
  ): Promise<void> {
    const learnables = this.store
      .learnables()
      .filter((l) => selectedLearnableIds.includes(l.id))

    const result = await this.modalService.open<ConfirmationType>('bulk-edit', {
      learnables
    })

    if (!this.isConfirmed(result)) return

    const { update, deleteIDs, add } = result.value
    this.store.updateLearnables(update)
    this.store.removeLearnables(deleteIDs)
    this.addLearnablesToStore(add, selectedCollection)
  }

  async confirmAndDeleteLearnables(learnableIds: string[]): Promise<void> {
    const count = learnableIds.length
    const message =
      count === 1
        ? 'Are you sure you want to delete this card?'
        : `Are you sure you want to delete ${count} cards?`

    const result = await this.modalService.open<ConfirmationType>('confirm', {
      message
    })

    if (!this.isConfirmed(result)) return

    this.store.removeLearnables(learnableIds)
    this.showInfoToast(`Removed ${count} cards`)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Collection Operations
  // ─────────────────────────────────────────────────────────────────────────────

  async openAddToCollectionModal(learnableIds: string[]): Promise<void> {
    const result = await this.modalService.open<ConfirmCollectionAddType>(
      'collection-add',
      { collections: this.store.collections() }
    )

    if (!this.isConfirmed(result)) return

    const { createName, addToId } = result.value
    const collectionName = this.addLearnablesToCollection(
      learnableIds,
      createName,
      addToId
    )

    this.showInfoToast(
      `Added ${learnableIds.length} cards to ${collectionName}`
    )
  }

  removeLearnablesFromCollection(
    collectionId: string,
    learnableIds: string[]
  ): void {
    this.store.editCollectionLearnables(collectionId, [], learnableIds)
    this.showInfoToast(`Removed ${learnableIds.length} cards from collection`)
  }

  async openRenameCollectionModal(collection: CollectionUser): Promise<void> {
    const result = await this.modalService.open<string>('collection-rename', {
      name: collection.name
    })

    if (!this.isConfirmed(result)) return

    this.store.editCollection(collection.id, result.value)
  }

  async openDeleteCollectionModal(collection: CollectionUser): Promise<void> {
    const result =
      await this.modalService.open<ConfirmCollectionDeletionType>(
        'collection-delete'
      )

    if (!this.isConfirmed(result)) return

    const removeCardsCompletely = result.value.deletionType === 'remove'
    this.store.deleteCollection(collection.id, removeCardsCompletely)
    this.showInfoToast(`Collection ${collection.name} deleted`)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sharing & Export Operations
  // ─────────────────────────────────────────────────────────────────────────────

  async openShareCollectionModal(
    bank: BankUser,
    collectionId: string
  ): Promise<void> {
    const result = await this.modalService.open<ShareFormResponse>(
      'bank-share',
      { bank }
    )

    if (!this.isConfirmed(result)) return

    const bankExport = mapToBankExport(bank, [collectionId])
    await this.apiService.shareBank(bankExport, result.value.ttlMinutes)
  }

  createDownloadableExport(bank: BankUser, collectionId?: string) {
    const collectionIds = collectionId ? [collectionId] : undefined
    const bankExport = mapToBankExport(bank, collectionIds)
    return this.blobService.createDownloadableFromLearnables(bankExport)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Private Helpers
  // ─────────────────────────────────────────────────────────────────────────────

  private isConfirmed<T>(
    result: ModalResult<T>
  ): result is ModalResult<T> & { type: 'confirm' } {
    return result.type === 'confirm'
  }

  private showInfoToast(message: string): void {
    this.toastService.showToast({ message, type: 'info' })
  }

  private addLearnablesToStore(
    learnables: LearnableBase[],
    selectedCollection: CollectionUser | null
  ): boolean {
    if (learnables.length === 0) return false

    const countBefore = this.store.learnables().length
    this.store.addLearnables(learnables)
    const countAfter = this.store.learnables().length
    const addedCount = countAfter - countBefore

    if (addedCount === 0) {
      this.toastService.showToast({
        message: 'No cards added — all were duplicates',
        type: 'error'
      })
      return false
    }

    const newIds = filterLearnables(this.store.learnables(), {
      age: 'newest'
    }).map((l) => l.id)

    if (selectedCollection) {
      this.store.editCollectionLearnables(selectedCollection.id, newIds, [])
      this.showInfoToast(
        `Created ${addedCount} cards and added them to ${selectedCollection.name}`
      )
    } else {
      this.showInfoToast(`Created ${addedCount} cards`)
    }

    return true
  }

  private addLearnablesToCollection(
    learnableIds: string[],
    createName?: string,
    addToId?: string
  ): string {
    if (createName) {
      this.store.createCollection(createName, learnableIds)
      return createName
    }

    if (addToId) {
      this.store.editCollectionLearnables(addToId, learnableIds, [])
      return (
        this.store.collections().find((c) => c.id === addToId)?.name ??
        'collection'
      )
    }

    return 'collection'
  }
}
