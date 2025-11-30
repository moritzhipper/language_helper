import { Component, effect, inject, untracked } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router'
import { map } from 'rxjs'
import z from 'zod'
import { ModalWrapperComp } from './components/shared/forms/modal-wrapper-comp/modal-wrapper-comp'
import { NavbarComp } from './components/shared/navbar-comp/navbar-comp'
import { ToastOutletComp } from './components/shared/toast-outlet-comp/toast-outlet-comp'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComp, ToastOutletComp, ModalWrapperComp],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private route = inject(ActivatedRoute)
  private queryParams = toSignal(this.route.queryParams)
  activeRoute = inject(ActivatedRoute)
  routerEvents = inject(Router).events.pipe(map(this.getActiveRouteData))
  sig = toSignal(this.routerEvents)

  constructor() {
    // Log URL parameter 'id' whenever it changes
    effect(() => {
      const params = this.queryParams()
      this.sig()

      if (!params) return

      untracked(() => {
        this.resolveIdFromUrl(params)
      })
    })
  }

  private resolveIdFromUrl(params: Params) {
    const id = params['id'] as string
    const parsedIdResult = z.uuid().safeParse(id)
    if (!parsedIdResult.success) return

    // todo: try to fetch shared bank with id from db here

    alert('implement')
  }

  getActiveRouteData(): unknown {
    // console.log(this.activeRoute)
    return
  }
}
