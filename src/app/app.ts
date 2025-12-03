import { Component, effect, inject, untracked } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Router,
  RouterOutlet
} from '@angular/router'
import { filter, map } from 'rxjs'
import z from 'zod'
import { ModalWrapperComp } from './components/shared/forms/modal-wrapper-comp/modal-wrapper-comp'
import { NavbarNewComp } from './components/shared/navbar-new-comp/navbar-new-comp'
import { ToastOutletComp } from './components/shared/toast-outlet-comp/toast-outlet-comp'

type PageConfig = {
  icon: string
  title: string
  mode: 'full' | 'compact'
}

const DEFAULT_PAGE_CONFIG: PageConfig = {
  icon: 'page',
  mode: 'compact',
  title: ''
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastOutletComp, ModalWrapperComp, NavbarNewComp],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private route = inject(ActivatedRoute)
  private queryParams = toSignal(this.route.queryParams)
  activeRoute = inject(ActivatedRoute)
  private readonly router = inject(Router)

  routerEvents = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.getPageConfig())
  )

  constructor() {
    // Log URL parameter 'id' whenever it changes
    effect(() => {
      const params = this.queryParams()

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

  getPageConfig(): PageConfig {
    const pageConfig = this.activeRoute.snapshot.firstChild?.data

    console.log('pageConfig', pageConfig)

    return DEFAULT_PAGE_CONFIG
  }
}
