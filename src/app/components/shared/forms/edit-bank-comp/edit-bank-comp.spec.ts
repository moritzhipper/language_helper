import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EditBankComp } from './edit-bank-comp'

describe('EditBankComp', () => {
  let component: EditBankComp
  let fixture: ComponentFixture<EditBankComp>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBankComp]
    }).compileComponents()

    fixture = TestBed.createComponent(EditBankComp)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
