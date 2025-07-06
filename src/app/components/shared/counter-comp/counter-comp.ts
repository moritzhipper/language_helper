import { Component, input } from '@angular/core'

@Component({
  selector: 'app-counter-comp',
  imports: [],
  templateUrl: './counter-comp.html',
  styleUrl: './counter-comp.scss',
  host: {
    '[class]': 'size()'
  }
})
export class CounterComp {
  label = input.required<string>()
  size = input<'s' | 'm' | 'l'>('m')
}
