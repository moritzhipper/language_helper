import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionInfoComp } from './collection-info-comp';

describe('CollectionInfoComp', () => {
  let component: CollectionInfoComp;
  let fixture: ComponentFixture<CollectionInfoComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionInfoComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionInfoComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
