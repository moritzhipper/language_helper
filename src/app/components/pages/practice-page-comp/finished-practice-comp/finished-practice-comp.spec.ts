import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedPracticeComp } from './finished-practice-comp';

describe('FinishedPracticeComp', () => {
  let component: FinishedPracticeComp;
  let fixture: ComponentFixture<FinishedPracticeComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishedPracticeComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishedPracticeComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
