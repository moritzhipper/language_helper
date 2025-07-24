import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NavbarComp } from './components/shared/navbar-comp/navbar-comp'
import { ToastOutletComp } from './components/shared/toast-outlet-comp/toast-outlet-comp'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComp, ToastOutletComp],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'language-helper'
}
