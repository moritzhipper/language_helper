import { Component, input } from '@angular/core'

@Component({
  selector: 'app-page-header-comp',
  templateUrl: './page-header-comp.html',
  styleUrl: './page-header-comp.scss'
})
export class PageHeaderComp {
  title = input.required<string>()
}
