import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeRatingComp } from './practice-rating-comp';

describe('PracticeRatingComp', () => {
  let component: PracticeRatingComp;
  let fixture: ComponentFixture<PracticeRatingComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeRatingComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeRatingComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
