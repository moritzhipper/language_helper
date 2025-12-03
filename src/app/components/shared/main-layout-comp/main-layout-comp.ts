import { Component, inject } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { filter, map } from 'rxjs'

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
  selector: 'app-main-layout-comp',
  imports: [],
  templateUrl: './main-layout-comp.html',
  styleUrl: './main-layout-comp.scss'
})
export class MainLayoutComp {
  private readonly activeRoute = inject(ActivatedRoute)
  private readonly router = inject(Router)

  pageConfig = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.getPageConfig())
  )

  getPageConfig(): PageConfig {
    const pageConfig = this.activeRoute.snapshot.firstChild?.data

    console.log('pageConfig', pageConfig)

    return DEFAULT_PAGE_CONFIG
  }
}
