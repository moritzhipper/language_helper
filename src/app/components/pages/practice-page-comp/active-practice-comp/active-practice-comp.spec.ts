import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePracticeComp } from './active-practice-comp';

describe('ActivePracticeComp', () => {
  let component: ActivePracticeComp;
  let fixture: ComponentFixture<ActivePracticeComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivePracticeComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivePracticeComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
