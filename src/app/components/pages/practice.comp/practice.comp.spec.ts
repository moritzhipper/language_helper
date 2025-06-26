import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeComp } from './practice.comp';

describe('PracticeComp', () => {
  let component: PracticeComp;
  let fixture: ComponentFixture<PracticeComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
