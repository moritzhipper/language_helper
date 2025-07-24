import { Routes } from '@angular/router'
import { CollectionsPageComp } from './components/pages/collections-page-comp/collections-page-comp'
import { OverviewComp } from './components/pages/overview-page-comp/overview-page-comp'
import { PracticeComp } from './components/pages/practice-page-comp/practice-page-comp'
import { SettingsComp } from './components/pages/settings-page-comp/settings-page-comp'

export const routes: Routes = [
  {
    component: OverviewComp,
    path: 'cards'
  },
  {
    component: PracticeComp,
    path: 'practice'
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
    redirectTo: 'cards',
    pathMatch: 'full'
  }
]
