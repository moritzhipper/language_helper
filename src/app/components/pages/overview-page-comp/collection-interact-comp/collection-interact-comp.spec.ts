import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionInteractComp } from './collection-interact-comp';

describe('CollectionInteractComp', () => {
  let component: CollectionInteractComp;
  let fixture: ComponentFixture<CollectionInteractComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionInteractComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionInteractComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
