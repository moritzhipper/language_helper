import { computed, Injectable, signal } from '@angular/core'
import { ModalResult, OpenModalConfig } from './modal-config'

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private _openModal = signal<OpenModalConfig | null>(null)
  readonly currentlyOpenModalConfig = computed(() => this._openModal())

  resolver: ((result: unknown) => void) | null = null

  async openModal<T>(config: OpenModalConfig): Promise<ModalResult<T>> {
    console.log('opening modal with config:', config)
    this._openModal.set(config)

    return new Promise<ModalResult<T>>((resolve) => {
      this.resolver = (result) => resolve(result as ModalResult<T>)
    })
  }

  resolveModal<T>(result: ModalResult<T>): void {
    if (this.resolver === null) return
    this._openModal.set(null)
    this.resolver(result as ModalResult<T>)
  }
}
