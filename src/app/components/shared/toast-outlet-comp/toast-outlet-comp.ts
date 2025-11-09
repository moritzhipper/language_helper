import { Component, inject } from '@angular/core'
import { ToastOptions, ToastService } from '../../../services/toast-service'

@Component({
  selector: 'app-toast-outlet-comp',
  imports: [],
  templateUrl: './toast-outlet-comp.html',
  styleUrl: './toast-outlet-comp.scss'
})
export class ToastOutletComp {
  private readonly _toastService = inject(ToastService)
  protected toasts = this._toastService.toasts

  getEnterAnimName(toast: ToastOptions): string {
    return toast.type === 'guess' ? 'guess-in' : 'toast-in'
  }

  getLeaveAnimName(toast: ToastOptions): string {
    return toast.type === 'guess' ? 'guess-out' : 'toast-out'
  }
}
