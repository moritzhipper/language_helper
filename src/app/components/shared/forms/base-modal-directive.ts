import { Directive, output } from '@angular/core'
import { ModalResult } from './modal-config'

@Directive()
export abstract class BaseModalDirective {
  readonly resolve = output<ModalResult<unknown>>()

  cancel(): void {
    this.resolve.emit({ type: 'cancel' })
  }
  confirm(value?: unknown): void {
    this.resolve.emit({ type: 'confirm', value })
  }
}
