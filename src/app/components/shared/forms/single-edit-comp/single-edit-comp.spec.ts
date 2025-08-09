import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleEditComp } from './single-edit-comp';

describe('SingleEditComp', () => {
  let component: SingleEditComp;
  let fixture: ComponentFixture<SingleEditComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleEditComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleEditComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
