import { Routes } from '@angular/router'
import { AboutPageComp } from './components/pages/about-page-comp/about-page-comp'
import { OverviewComp } from './components/pages/overview-page-comp/overview-page-comp'
import { PracticeComp } from './components/pages/practice-page-comp/practice-page-comp'
import { SettingsComp } from './components/pages/settings-page-comp/settings-page-comp'
import { SharePageComp } from './components/pages/share-page-comp/share-page-comp'

export const routes: Routes = [
  {
    component: OverviewComp,
    path: 'cards',
    title: 'LWM | Cards'
  },
  {
    component: PracticeComp,
    path: 'practice',
    title: 'LWM | Practice'
  },
  {
    component: SharePageComp,
    path: 'share',
    title: 'LWM | Share'
  },
  {
    component: AboutPageComp,
    path: 'about',
    title: 'LWM | About'
  },
  {
    component: SettingsComp,
    path: 'settings',
    title: 'LWM | Settings'
  },
  {
    path: '**',
    redirectTo: 'cards',
    pathMatch: 'full'
  }
]
