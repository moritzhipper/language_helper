import { Routes } from '@angular/router'
import { OverviewComp } from './components/pages/overview.comp/overview.comp'
import { PracticeComp } from './components/pages/practice.comp/practice.comp'
import { SettingsComp } from './components/pages/settings.comp/settings.comp'

export const routes: Routes = [
  {
    component: PracticeComp,
    path: '',
  },
  {
    component: OverviewComp,
    path: 'overview',
  },
  {
    component: SettingsComp,
    path: 'settings',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
]
