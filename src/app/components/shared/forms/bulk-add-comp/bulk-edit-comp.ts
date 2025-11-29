import { CommonModule } from '@angular/common'
import {
  Component,
  effect,
  inject,
  input,
  signal,
  untracked
} from '@angular/core'
import {
  AbstractControl,
  FormArray,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import {
  LearnableBase,
  UserLearnable,
  UserLearnablePartial
} from '../../../../types_and_schemas/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'
import { BaseModalDirective } from '../base-modal-directive'

export type ConfirmationType = {
  update: UserLearnablePartial[]
  add: LearnableBase[]
  deleteIDs: string[]
}

@Component({
  selector: 'app-bulk-edit-comp',
  imports: [ReactiveFormsModule, CommonModule, RadioComp, IconComp],
  templateUrl: './bulk-edit-comp.html',
  styleUrl: './bulk-edit-comp.scss'
})
export class BulkEditComp extends BaseModalDirective {
  private readonly _fb = inject(NonNullableFormBuilder)

  learnables = input<UserLearnable[]>()
  deletedLIDs = signal<string[]>([])
  learnablesForm = this._fb.group({
    learnables: this._fb.array<LearnableBase>([])
  })

  constructor() {
    super()
    effect(() => {
      const preset = this.learnables()
      untracked(() => {
        if (!preset || preset.length === 0) {
          this.addLearnable()
        } else {
          this.mapLearnablesToFormArray(preset)
        }
      })
    })
  }

  get learnablesFormArray(): FormArray {
    return this.learnablesForm.get('learnables') as FormArray<
      AbstractControl<LearnableBase>
    >
  }

  addLearnable(): void {
    this.learnablesFormArray.push(this.createLearnableFormGroup())
  }

  removeLearnable(index: number): void {
    const removedLId = this.learnablesFormArray.at(index).value.id
    if (removedLId) this.deletedLIDs.update((ids) => [...ids, removedLId])
    this.learnablesFormArray.removeAt(index)
  }

  private createLearnableFormGroup(preset?: UserLearnable): FormGroup {
    if (!preset) {
      return this._fb.group({
        lexeme: ['', Validators.required],
        translation: ['', Validators.required],
        type: ['word'],
        notes: [''],
        id: [null]
      })
    }

    return this._fb.group({
      lexeme: [preset.lexeme, Validators.required],
      translation: [preset.translation, Validators.required],
      type: [preset.type],
      notes: [preset.notes],
      id: [preset.id || null]
    })
  }

  confirmForm(): void {
    if (!this.learnablesForm.valid) return

    const formArrayValue = this.learnablesFormArray.value as Partial<
      LearnableBase & { id?: string }
    >[]

    // learnables which came from preset, that the user wants to update
    const updated = formArrayValue.filter((v) => v.id) as UserLearnablePartial[]

    // learnables which came not from preset, that the user wants to add
    const added = formArrayValue.filter((v) => !v.id) as LearnableBase[]

    const confirm: ConfirmationType = {
      deleteIDs: this.deletedLIDs(),
      update: updated,
      add: added
    }
    this.confirm(confirm)
  }

  private mapLearnablesToFormArray(learnables: UserLearnable[]): void {
    this.learnablesFormArray.clear()
    learnables.forEach((learnable) =>
      this.learnablesFormArray.push(this.createLearnableFormGroup(learnable))
    )
  }
}
