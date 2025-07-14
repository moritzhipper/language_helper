import { computed, Injectable, signal } from '@angular/core'

type ToastOptions = {
  message: string
  type: 'info' | 'error' | 'guess'
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts = signal<ToastOptions[]>([])

  toasts = computed(() => this._toasts())

  showToast(config: ToastOptions) {
    this._toasts.update((toasts) => [...toasts, config])
    const time = config.type === 'guess' ? 1000 : 4000

    setTimeout(() => {
      this._toasts.update((t) => t.slice(1))
    }, time)
  }
}
