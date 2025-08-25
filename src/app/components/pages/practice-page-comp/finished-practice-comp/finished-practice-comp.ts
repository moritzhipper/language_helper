import { Component } from '@angular/core'
import { IconComp } from '../../../shared/icon-comp/icon-comp'
import { PageWrapperComp } from '../../../shared/page-wrapper-comp/page-wrapper-comp'

@Component({
  selector: 'app-finished-practice-comp',
  imports: [IconComp, PageWrapperComp],
  templateUrl: './finished-practice-comp.html',
  styleUrl: './finished-practice-comp.scss'
})
export class FinishedPracticeComp {}
