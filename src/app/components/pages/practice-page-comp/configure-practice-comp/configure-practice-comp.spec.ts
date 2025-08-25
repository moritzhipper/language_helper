import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurePracticeComp } from './configure-practice-comp';

describe('ConfigurePracticeComp', () => {
  let component: ConfigurePracticeComp;
  let fixture: ComponentFixture<ConfigurePracticeComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurePracticeComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurePracticeComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
