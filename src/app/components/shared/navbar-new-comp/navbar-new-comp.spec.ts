import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarNewComp } from './navbar-new-comp';

describe('NavbarNewComp', () => {
  let component: NavbarNewComp;
  let fixture: ComponentFixture<NavbarNewComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarNewComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarNewComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
