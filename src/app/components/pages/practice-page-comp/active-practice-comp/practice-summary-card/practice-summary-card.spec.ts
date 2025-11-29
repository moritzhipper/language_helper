import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeSummaryCard } from './practice-summary-card';

describe('PracticeSummaryCard', () => {
  let component: PracticeSummaryCard;
  let fixture: ComponentFixture<PracticeSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeSummaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeSummaryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
