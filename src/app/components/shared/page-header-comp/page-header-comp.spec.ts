import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PageHeaderComp } from './page-header-comp'

describe('PageHeaderComp', () => {
  let component: PageHeaderComp
  let fixture: ComponentFixture<PageHeaderComp>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComp]
    }).compileComponents()

    fixture = TestBed.createComponent(PageHeaderComp)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
