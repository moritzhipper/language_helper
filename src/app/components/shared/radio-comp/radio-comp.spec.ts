import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioComp } from './radio-comp';

describe('RadioComp', () => {
  let component: RadioComp;
  let fixture: ComponentFixture<RadioComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
