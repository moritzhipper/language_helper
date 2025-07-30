import { Type } from '@angular/core'
import { BulkEditComp } from '../components/pages/overview-page-comp/bulk-add-comp/bulk-edit-comp'
import { CollectionAddComp } from '../components/pages/overview-page-comp/collection-add-comp/collection-add-comp'
import { ConfirmFormComp } from '../components/shared/confirm-form-comp/confirm-form-comp'
import { MagicAddComp } from '../components/shared/forms/magic-add-comp/magic-add-comp'

export type ModalType = 'magic-add' | 'bulk-edit' | 'confirm' | 'collection-add'

export type OpenModalConfig = {
  type: ModalType
  preset?: unknown
  config?: unknown
}

export type ModalResult<T> = { type: 'confirm'; value: T } | { type: 'cancel' }

export const modalConfig: Record<ModalType, Type<unknown>> = {
  'magic-add': MagicAddComp,
  'bulk-edit': BulkEditComp,
  confirm: ConfirmFormComp,
  'collection-add': CollectionAddComp
}

export const getModalComponent = (type: ModalType): Type<unknown> => {
  if (!modalConfig[type])
    throw new Error(`Modal type "${type}" is not defined in modalConfig`)

  return modalConfig[type]
}
