import { Component, input } from '@angular/core'

export type IconType =
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
  | 'collection'
  | 'collection-add'
  | 'collection-remove'
  | 'share'
  | 'import'
  | 'warn'

@Component({
  selector: 'app-icon-comp',
  imports: [],
  templateUrl: './icon-comp.html',
  styleUrl: './icon-comp.scss',
  host: {
    '[style.--dimension]': 'size() + "px"'
  }
})
export class IconComp {
  type = input.required<IconType>()
  size = input<number>(24)
}
