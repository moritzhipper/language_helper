import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageWrapperComp } from './page-wrapper-comp';

describe('PageWrapperComp', () => {
  let component: PageWrapperComp;
  let fixture: ComponentFixture<PageWrapperComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageWrapperComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageWrapperComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
