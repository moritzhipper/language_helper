import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.comp.html',
  styleUrl: './navbar.comp.scss',
})
export class NavbarComp {}
