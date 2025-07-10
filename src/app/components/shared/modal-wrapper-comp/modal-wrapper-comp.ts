import { Component, output, signal } from '@angular/core'

export abstract class ModalContent {
  abstract cancel: () => void
  abstract confirm: () => void
}

@Component({
  selector: 'app-modal-wrapper-comp',
  imports: [],
  templateUrl: './modal-wrapper-comp.html',
  styleUrl: './modal-wrapper-comp.scss',
  host: {
    '[class.open]': 'isOpen()'
  }
})
export class ModalWrapperComp {
  isOpen = signal(false)
  closed = output<void>()

  open() {
    this.isOpen.set(true)
  }

  close() {
    this.isOpen.set(false)
    this.closed.emit()
  }
}
