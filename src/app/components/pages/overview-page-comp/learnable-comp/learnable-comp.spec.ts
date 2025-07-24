import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnableComp } from './learnable-comp';

describe('LearnableComp', () => {
  let component: LearnableComp;
  let fixture: ComponentFixture<LearnableComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnableComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnableComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
