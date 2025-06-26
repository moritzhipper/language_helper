import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NavbarComp } from './components/shared/navbar.comp/navbar.comp'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComp],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'language-helper'
}
