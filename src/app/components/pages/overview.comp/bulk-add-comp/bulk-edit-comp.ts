import { CommonModule } from '@angular/common'
import {
  Component,
  effect,
  inject,
  input,
  output,
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
  Learnable,
  LearnableBase,
  LearnablePartialWithId
} from '../../../../types_and_schemas/types'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { RadioComp } from '../../../shared/radio-comp/radio-comp'

export type ConfirmationType = {
  update: LearnablePartialWithId[]
  add: LearnableBase[]
  deleteIDs: string[]
}

@Component({
  selector: 'app-bulk-edit-comp',
  imports: [ReactiveFormsModule, CommonModule, RadioComp, IconComp],
  templateUrl: './bulk-edit-comp.html',
  styleUrl: './bulk-edit-comp.scss'
})
export class BulkEditComp {
  private readonly _fb = inject(NonNullableFormBuilder)

  preset = input<Learnable[] | null>()

  deletedLIDs = signal<string[]>([])

  confirm = output<ConfirmationType>()
  cancel = output<void>()

  learnablesForm = this._fb.group({
    learnables: this._fb.array<LearnableBase>([])
  })

  constructor() {
    effect(() => {
      const preset = this.preset()
      if (!preset) return
      untracked(() => {
        this.mapLearnablesToFormArray(preset)
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

  private createLearnableFormGroup(preset?: Learnable): FormGroup {
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

    // fix this -> doesnt map to. the orrect type back
    // learnables which came from preset, that the user wants to update
    const updated = formArrayValue.filter(
      (v) => v.id
    ) as LearnablePartialWithId[]

    // learnables which came not from preset, that the user wants to add
    const added = formArrayValue.filter((v) => !v.id) as LearnableBase[]

    const confirm: ConfirmationType = {
      deleteIDs: this.deletedLIDs(),
      update: updated,
      add: added
    }

    this.confirm.emit(confirm)
    this.reset()
  }

  cancelForm() {
    this.reset()
    this.cancel.emit()
  }

  mapLearnablesToFormArray(learnables: Learnable[]): void {
    this.learnablesFormArray.clear()
    learnables.forEach((learnable) =>
      this.learnablesFormArray.push(this.createLearnableFormGroup(learnable))
    )
  }

  reset() {
    this.deletedLIDs.set([])
    this.learnablesForm.reset()
    const preset = this.preset()
    if (preset) {
      this.mapLearnablesToFormArray(preset)
    }
  }
}
