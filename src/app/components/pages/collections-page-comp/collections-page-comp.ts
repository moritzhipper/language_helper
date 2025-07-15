import { Component, inject, signal } from '@angular/core'
import { LearnablesStore } from '../../../store/learnablesStore'
import { IconComp } from '../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../page-wrapper-comp/page-wrapper-comp'

@Component({
  selector: 'app-collections-page-comp',
  imports: [PageWrapperComp, IconComp],
  templateUrl: './collections-page-comp.html',
  styleUrl: './collections-page-comp.scss'
})
export class CollectionsPageComp {
  private readonly _lState = inject(LearnablesStore)
  collections = this._lState.collections
  selectedCollectionId = signal<string | null>(null)
}
