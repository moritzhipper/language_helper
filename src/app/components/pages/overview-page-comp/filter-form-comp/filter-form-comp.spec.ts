import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterFormComp } from './filter-form-comp';

describe('FilterFormComp', () => {
  let component: FilterFormComp;
  let fixture: ComponentFixture<FilterFormComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterFormComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterFormComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
