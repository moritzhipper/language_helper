import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastOutletComp } from './toast-outlet-comp';

describe('ToastOutletComp', () => {
  let component: ToastOutletComp;
  let fixture: ComponentFixture<ToastOutletComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastOutletComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastOutletComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
