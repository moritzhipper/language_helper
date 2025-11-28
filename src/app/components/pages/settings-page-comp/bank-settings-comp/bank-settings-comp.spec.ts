import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankSettingsComp } from './bank-settings-comp';

describe('BankSettingsComp', () => {
  let component: BankSettingsComp;
  let fixture: ComponentFixture<BankSettingsComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankSettingsComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankSettingsComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
