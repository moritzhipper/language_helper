import { Component } from '@angular/core'
import { PageWrapperComp } from '../../shared/page-wrapper-comp/page-wrapper-comp'
import { SharedCollectionComp } from './shared-collection-comp/shared-collection-comp'

@Component({
  selector: 'app-share-page-comp',
  imports: [PageWrapperComp, SharedCollectionComp],
  templateUrl: './share-page-comp.html',
  styleUrl: './share-page-comp.scss'
})
export class SharePageComp {}
