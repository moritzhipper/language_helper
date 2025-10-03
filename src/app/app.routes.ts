import { Routes } from '@angular/router'
import { AboutPageComp } from './components/pages/about-page-comp/about-page-comp'
import { CollectionsPageComp } from './components/pages/collections-page-comp/collections-page-comp'
import { OverviewComp } from './components/pages/overview-page-comp/overview-page-comp'
import { PracticeComp } from './components/pages/practice-page-comp/practice-page-comp'
import { SettingsComp } from './components/pages/settings-page-comp/settings-page-comp'
import { SharePageComp } from './components/pages/share-page-comp/share-page-comp'

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
    component: SharePageComp,
    path: 'share'
  },
  {
    component: AboutPageComp,
    path: 'about'
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
