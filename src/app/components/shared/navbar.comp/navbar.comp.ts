import { Component, inject, signal } from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { RouterLink } from '@angular/router'
import { LearnablesStore } from '../../../store/learnablesStore'

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './navbar.comp.html',
  styleUrl: './navbar.comp.scss'
})
export class NavbarComp {
  lStore = inject(LearnablesStore)

  convertForm = new FormGroup({
    textarea: new FormControl('', Validators.required)
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
    const text = this.convertForm.value.textarea
    console.info('Converting text:', text)
    if (this.convertForm.invalid || !text) return
    await this.lStore.addLearnables(text)
  }
}
