import { Type } from '@angular/core'
import { BulkEditComp } from './bulk-add-comp/bulk-edit-comp'
import { CollectionAddComp } from './collection-add-comp/collection-add-comp'
import { ConfirmFormComp } from './confirm-form-comp/confirm-form-comp'
import { DeleteCollectionComp } from './delete-collection-comp/delete-collection-comp'
import { EditBankComp } from './edit-bank-comp/edit-bank-comp'
import { EditCollectionComp } from './edit-collection-comp/edit-collection-comp'
import { ImportFormComp } from './import-form-comp/import-form-comp'
import { MagicAddComp } from './magic-add-comp/magic-add-comp'
import { ShareFormComp } from './share-form-comp/share-form-comp'
import { SingleEditComp } from './single-edit-comp/single-edit-comp'

export type ModalType =
  | 'magic-add'
  | 'bulk-edit'
  | 'single-edit'
  | 'confirm'
  | 'collection-add'
  | 'collection-rename'
  | 'collection-delete'
  | 'bank-import'
  | 'bank-share'
  | 'edit-bank'

export type OpenModalConfig = {
  type: ModalType
  config?: unknown
}

export type ModalResult<T> = { type: 'confirm'; value: T } | { type: 'cancel' }

export const modalConfig: Record<ModalType, Type<unknown>> = {
  'magic-add': MagicAddComp,
  'single-edit': SingleEditComp,
  'bulk-edit': BulkEditComp,
  confirm: ConfirmFormComp,
  'collection-add': CollectionAddComp,
  'collection-rename': EditCollectionComp,
  'collection-delete': DeleteCollectionComp,
  'bank-import': ImportFormComp,
  'bank-share': ShareFormComp,
  'edit-bank': EditBankComp
}

export const getModalComponent = (type: ModalType): Type<unknown> => {
  if (!modalConfig[type])
    throw new Error(`Modal type "${type}" is not defined in modalConfig`)

  return modalConfig[type]
}
