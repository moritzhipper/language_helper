import { computed, Injectable, signal } from '@angular/core'
import {
  ModalResult,
  ModalType,
  OpenModalConfig
} from '../components/shared/forms/modal-config'

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private _openModal = signal<OpenModalConfig | null>(null)
  readonly currentlyOpenModalConfig = computed(() => this._openModal())

  resolver: ((result: unknown) => void) | null = null

  async open<T>(type: ModalType, config?: unknown): Promise<ModalResult<T>> {
    this._openModal.set({ type, config })

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
