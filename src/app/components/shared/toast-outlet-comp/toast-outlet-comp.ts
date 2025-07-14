import { Component, inject } from '@angular/core'
import { ToastService } from '../../../services/toast-service'

@Component({
  selector: 'app-toast-outlet-comp',
  imports: [],
  templateUrl: './toast-outlet-comp.html',
  styleUrl: './toast-outlet-comp.scss'
})
export class ToastOutletComp {
  private _toastService = inject(ToastService)
  toasts = this._toastService.toasts
}
