import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OverviewComp } from './overview-page-comp'

describe('OverviewComp', () => {
  let component: OverviewComp
  let fixture: ComponentFixture<OverviewComp>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewComp]
    }).compileComponents()

    fixture = TestBed.createComponent(OverviewComp)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
