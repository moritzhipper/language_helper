import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutComp } from './main-layout-comp';

describe('MainLayoutComp', () => {
  let component: MainLayoutComp;
  let fixture: ComponentFixture<MainLayoutComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
