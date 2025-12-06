import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageIconComp } from './page-icon-comp';

describe('PageIconComp', () => {
  let component: PageIconComp;
  let fixture: ComponentFixture<PageIconComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageIconComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageIconComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
