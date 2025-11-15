import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeCardComp } from './practice-card-comp';

describe('PracticeCardComp', () => {
  let component: PracticeCardComp;
  let fixture: ComponentFixture<PracticeCardComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeCardComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeCardComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
