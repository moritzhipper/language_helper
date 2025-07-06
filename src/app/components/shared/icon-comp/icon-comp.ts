import { Component, input } from '@angular/core'

type IconType = 'add' | 'chevron'

@Component({
  selector: 'app-icon-comp',
  imports: [],
  templateUrl: './icon-comp.html',
  styleUrl: './icon-comp.scss'
})
export class IconComp {
  type = input.required<IconType>()
  size = input<number>(24)
}
