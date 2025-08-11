import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPageComp } from './about-page-comp';

describe('AboutPageComp', () => {
  let component: AboutPageComp;
  let fixture: ComponentFixture<AboutPageComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPageComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutPageComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
