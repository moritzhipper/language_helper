import { Component, inject, signal } from '@angular/core'
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { RouterLink } from '@angular/router'
import { LearnablesStore } from '../../../store/learnablesStore'
import { LearnableCreationConfig } from '../../../types_and_schemas/types'
import { IconComp } from '../icon-comp/icon-comp'
import { RadioComp } from '../radio-comp/radio-comp'

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ReactiveFormsModule, IconComp, RadioComp],
  templateUrl: './navbar.comp.html',
  styleUrl: './navbar.comp.scss'
})
export class NavbarComp {
  private _lStore = inject(LearnablesStore)

  private readonly _fb = inject(NonNullableFormBuilder)

  convertForm = this._fb.group({
    text: ['', Validators.required],
    allowType: 'both'
  })

  linksOpen = signal(false)
  addOpen = signal(false)

  toggleLinks() {
    if (this.addOpen()) {
      this.addOpen.set(false)
      this.linksOpen.set(false)
    } else {
      this.linksOpen.update((o) => !o)
    }
  }

  showAdd() {
    this.linksOpen.set(false)
    this.addOpen.set(true)
  }

  async convert() {
    const text = this.convertForm.value.text
    const allowType = this.convertForm.value.allowType
    const allowWords = allowType === 'words' || allowType === 'both'
    const allowPhrases = allowType === 'phrases' || allowType === 'both'

    if (this.convertForm.invalid || !text) return
    const config: LearnableCreationConfig = {
      text,
      allowWords,
      allowPhrases
    }
    await this._lStore.addLearnables(config)
  }
}
