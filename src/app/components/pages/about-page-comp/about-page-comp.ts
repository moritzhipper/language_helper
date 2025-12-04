import { Component } from '@angular/core'
import { CoolHeaderComp } from '../../shared/cool-header-comp/cool-header-comp'

@Component({
  selector: 'app-about-page-comp',
  imports: [CoolHeaderComp],
  templateUrl: './about-page-comp.html',
  styleUrl: './about-page-comp.scss',
  host: {
    class: 'page mid'
  }
})
export class AboutPageComp {}
