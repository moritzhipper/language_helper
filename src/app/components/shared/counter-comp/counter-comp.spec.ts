import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterComp } from './counter-comp';

describe('CounterComp', () => {
  let component: CounterComp;
  let fixture: ComponentFixture<CounterComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CounterComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
