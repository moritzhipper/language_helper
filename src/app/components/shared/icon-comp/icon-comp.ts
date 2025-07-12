import { Component, input } from '@angular/core'

type IconType =
  | 'settings'
  | 'chevron'
  | 'list'
  | 'learn'
  | 'magic'
  | 'menu'
  | 'new'
  | 'pen'
  | 'ai-pen'
  | 'trash'
  | 'edit'
  | 'reset'
  | 'add'
  | 'play'

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
