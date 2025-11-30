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
    title: 'Cards',
    data: {
      icon: 'card',
      mode: 'full'
    }
  },
  {
    component: PracticeComp,
    path: 'practice',
    title: 'Practice',
    data: {
      icon: 'learn'
    }
  },
  {
    component: SharePageComp,
    path: 'share',
    title: 'Share',
    data: {
      icon: 'share-network-fill'
    }
  },
  {
    component: AboutPageComp,
    path: 'about',
    title: 'About',
    data: {
      icon: 'info'
    }
  },
  {
    component: SettingsComp,
    path: 'settings',
    title: 'Settings',
    data: {
      icon: 'settings'
    }
  },
  {
    path: '**',
    redirectTo: 'cards',
    pathMatch: 'full'
  }
]
