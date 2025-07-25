import { Component, computed, inject, signal, viewChild } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { LearnablesStore } from '../../../store/learnablesStore'
import {
  LearnableBase,
  LearnablesFilterConfig
} from '../../../types_and_schemas/types'
import { filterLearnables } from '../../../utils/learnables-filter'
import { ConfirmFormComp } from '../../shared/confirm-form-comp/confirm-form-comp'
import { CounterComp } from '../../shared/counter-comp/counter-comp'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { ModalWrapperComp } from '../../shared/modal-wrapper-comp/modal-wrapper-comp'
import { PageWrapperComp } from '../page-wrapper-comp/page-wrapper-comp'
import { BulkEditComp, ConfirmationType } from './bulk-add-comp/bulk-edit-comp'
import { FilterFormComp } from './filter-form-comp/filter-form-comp'
import { LearnableComp } from './learnable-comp/learnable-comp'
import { MagicAddComp } from './magic-add-comp/magic-add-comp'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.comp.html',
  styleUrl: './overview.comp.scss',
  imports: [
    ReactiveFormsModule,
    LearnableComp,
    PageWrapperComp,
    IconComp,
    ModalWrapperComp,
    MagicAddComp,
    BulkEditComp,
    ConfirmFormComp,
    CounterComp,
    FilterFormComp
  ]
})
export class OverviewComp {
  private readonly addModal = viewChild.required<ModalWrapperComp>('addModal')
  private readonly deleteModal =
    viewChild.required<ModalWrapperComp>('deleteModal')
  private readonly bulkEditModal =
    viewChild.required<ModalWrapperComp>('bulkEditModal')

  private readonly _learnablesS = inject(LearnablesStore)
  private _learnables = this._learnablesS.learnables

  private filter = signal<LearnablesFilterConfig | null>(null)

  hasSelected = computed(() => this.selectedLearnableIds().length > 0)
  selectedLearnableIds = signal<string[]>([])

  selectedLearnables = computed(() =>
    this._learnables().filter((l) => this.selectedLearnableIds().includes(l.id))
  )
  learnableLexemes = computed(() =>
    this.selectedLearnables().map((l) => l.lexeme)
  )

  filteredLearnables = computed(() => {
    const filter = this.filter()
    const learnables = this._learnables()
    if (!filter) return learnables

    return filterLearnables(this._learnables(), filter)
  })

  resetSelection() {
    this.selectedLearnableIds.set([])
  }

  confirmAdd(learnables: LearnableBase[]) {
    this._learnablesS.addLearnables(learnables)
    this.addModal().close()
  }

  confirmEdit(conf: ConfirmationType) {
    this._learnablesS.updateLearnables(conf.update)
    this._learnablesS.removeLearnables(conf.deleteIDs)
    this._learnablesS.addLearnables(conf.add)
    this.bulkEditModal().close()
  }

  confirmDelete() {
    this.deleteModal().close()
    this._learnablesS.removeLearnables(this.selectedLearnableIds())
  }

  toggleSelection(lId: string) {
    if (this.selectedLearnableIds().includes(lId)) {
      this.selectedLearnableIds.update((s) => s.filter((id) => id !== lId))
    } else {
      this.selectedLearnableIds.update((s) => [...s, lId])
    }
  }

  isSelected(lId: string): boolean {
    return this.selectedLearnableIds().includes(lId)
  }

  updateFilter(filter: LearnablesFilterConfig) {
    this.filter.set(filter)
  }
}
