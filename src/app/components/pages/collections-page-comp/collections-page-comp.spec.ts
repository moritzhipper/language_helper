import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsPageComp } from './collections-page-comp';

describe('CollectionsPageComp', () => {
  let component: CollectionsPageComp;
  let fixture: ComponentFixture<CollectionsPageComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsPageComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionsPageComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
