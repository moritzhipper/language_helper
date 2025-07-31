import { NgComponentOutlet } from '@angular/common'
import {
  Component,
  computed,
  DOCUMENT,
  effect,
  HostListener,
  inject,
  OutputRefSubscription,
  untracked,
  viewChild
} from '@angular/core'
import { ModalService } from '../../../../services/modal-service'
import { BaseModalDirective } from '../base-modal-directive'
import { getModalComponent, ModalResult } from '../modal-config'

export abstract class ModalContent {
  abstract cancel: () => void
  abstract confirm: () => void
}

@Component({
  selector: 'app-modal-wrapper-comp',
  imports: [NgComponentOutlet],
  templateUrl: './modal-wrapper-comp.html',
  styleUrl: './modal-wrapper-comp.scss'
})
export class ModalWrapperComp {
  isOpen = computed(() => !!this.modalService.currentlyOpenModalConfig())
  outlet = viewChild(NgComponentOutlet)
  private _submitSubscription: OutputRefSubscription | null = null

  modalService = inject(ModalService)
  private document = inject(DOCUMENT)

  currentModalConfig = computed(() => {
    const modalConf = this.modalService.currentlyOpenModalConfig()
    if (!modalConf) return null
    const component = getModalComponent(modalConf.type)
    if (!component) return null

    const config = modalConf.config

    if (!config) {
      return { component }
    }

    return {
      inputs: { ...config },
      component
    }
  })

  constructor() {
    effect(() => {
      const instance = this.outlet()?.componentInstance as BaseModalDirective

      untracked(() => {
        if (instance) {
          this.document.body.style.overflow = 'hidden'
          this._submitSubscription = instance.resolve.subscribe(
            this.formResolve
          )
        } else {
          this.document.body.style.overflow = 'auto'
          this._submitSubscription?.unsubscribe()
          this._submitSubscription = null
        }
      })
    })
  }

  private formResolve = (result: ModalResult<unknown>): void => {
    this.modalService.resolveModal(result as ModalResult<unknown>)
  }

  @HostListener('window:keydown.escape')
  close() {
    this.modalService.resolveModal({ type: 'cancel' })
  }
}
