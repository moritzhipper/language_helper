import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankComp } from './add-bank-comp';

describe('AddBankComp', () => {
  let component: AddBankComp;
  let fixture: ComponentFixture<AddBankComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBankComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBankComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
