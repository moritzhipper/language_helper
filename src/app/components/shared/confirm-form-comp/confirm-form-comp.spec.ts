import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmFormComp } from './confirm-form-comp';

describe('ConfirmFormComp', () => {
  let component: ConfirmFormComp;
  let fixture: ComponentFixture<ConfirmFormComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmFormComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmFormComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
