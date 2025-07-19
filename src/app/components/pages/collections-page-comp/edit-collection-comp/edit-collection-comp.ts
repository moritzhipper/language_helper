import {
  Component,
  effect,
  inject,
  input,
  output,
  untracked
} from '@angular/core'
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'

@Component({
  selector: 'app-edit-collection-comp',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-collection-comp.html',
  styleUrl: './edit-collection-comp.scss'
})
export class EditCollectionComp {
  private _fb = inject(NonNullableFormBuilder)

  form = this._fb.group({
    name: ['', Validators.required]
  })

  confirm = output<string>()
  cancel = output<void>()
  preset = input<string | undefined>()

  constructor() {
    effect(() => {
      const preset = this.preset()
      if (!preset) return
      untracked(() => {
        this.form.patchValue({ name: preset })
      })
    })
  }

  onConfirm() {
    const { name } = this.form.value
    if (!name) return
    this.confirm.emit(name)
    this.reset()
  }

  onCancel() {
    this.cancel.emit()
    this.reset()
  }

  reset() {
    this.form.reset()
    const preset = this.preset()
    if (preset) {
      this.form.patchValue({ name: preset })
    }
  }
}
