import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingComp } from './onboarding-comp';

describe('OnboardingComp', () => {
  let component: OnboardingComp;
  let fixture: ComponentFixture<OnboardingComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
