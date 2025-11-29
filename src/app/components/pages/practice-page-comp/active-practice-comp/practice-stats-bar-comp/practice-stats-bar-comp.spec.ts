import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeStatsBarComp } from './practice-stats-bar-comp';

describe('PracticeStatsBarComp', () => {
  let component: PracticeStatsBarComp;
  let fixture: ComponentFixture<PracticeStatsBarComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeStatsBarComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeStatsBarComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
