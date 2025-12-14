import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingSectionComp } from './onboarding-section-comp';

describe('OnboardingSectionComp', () => {
  let component: OnboardingSectionComp;
  let fixture: ComponentFixture<OnboardingSectionComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingSectionComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingSectionComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
