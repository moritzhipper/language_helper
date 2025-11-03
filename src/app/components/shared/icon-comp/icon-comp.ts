import { Component, input } from '@angular/core'

export type IconType =
  | 'settings'
  | 'chevron'
  | 'card'
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
  | 'share-network'
  | 'share-network-fill'
  | 'share-fill'
  | 'import'
  | 'warn'
  | 'info'
  | 'copy'
  | 'left-right'

@Component({
  selector: 'app-icon-comp',
  imports: [],
  templateUrl: './icon-comp.html',
  styleUrl: './icon-comp.scss',
  host: {
    '[style.--dimension]': 'size() + "px"',
    '[class.inline]': 'inline()'
  }
})
export class IconComp {
  type = input.required<IconType>()
  size = input<number>(24)
  inline = input<boolean>(false)
}
