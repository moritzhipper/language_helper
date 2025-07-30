import { Type } from '@angular/core'
import { BulkEditComp } from './bulk-add-comp/bulk-edit-comp'
import { CollectionAddComp } from './collection-add-comp/collection-add-comp'
import { ConfirmFormComp } from './confirm-form-comp/confirm-form-comp'
import { EditCollectionComp } from './edit-collection-comp/edit-collection-comp'
import { MagicAddComp } from './magic-add-comp/magic-add-comp'

export type ModalType =
  | 'magic-add'
  | 'bulk-edit'
  | 'confirm'
  | 'collection-add'
  | 'collection-rename'

export type OpenModalConfig = {
  type: ModalType
  config?: unknown
}

export type ModalResult<T> = { type: 'confirm'; value: T } | { type: 'cancel' }

export const modalConfig: Record<ModalType, Type<unknown>> = {
  'magic-add': MagicAddComp,
  'bulk-edit': BulkEditComp,
  confirm: ConfirmFormComp,
  'collection-add': CollectionAddComp,
  'collection-rename': EditCollectionComp
}

export const getModalComponent = (type: ModalType): Type<unknown> => {
  if (!modalConfig[type])
    throw new Error(`Modal type "${type}" is not defined in modalConfig`)

  return modalConfig[type]
}
