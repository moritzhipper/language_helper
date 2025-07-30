import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWrapperComp } from './modal-wrapper-comp';

describe('ModalWrapperComp', () => {
  let component: ModalWrapperComp;
  let fixture: ComponentFixture<ModalWrapperComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalWrapperComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalWrapperComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
