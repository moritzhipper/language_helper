import { Routes } from '@angular/router'
import { CollectionsPageComp } from './components/pages/collections-page-comp/collections-page-comp'
import { OverviewComp } from './components/pages/overview.comp/overview.comp'
import { PracticeComp } from './components/pages/practice.comp/practice.comp'
import { SettingsComp } from './components/pages/settings.comp/settings.comp'

export const routes: Routes = [
  {
    component: PracticeComp,
    path: ''
  },
  {
    component: OverviewComp,
    path: 'cards'
  },
  {
    component: CollectionsPageComp,
    path: 'collections'
  },
  {
    component: SettingsComp,
    path: 'settings'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
]
