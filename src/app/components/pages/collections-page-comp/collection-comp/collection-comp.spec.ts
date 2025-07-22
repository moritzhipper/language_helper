import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionComp } from './collection-comp';

describe('CollectionComp', () => {
  let component: CollectionComp;
  let fixture: ComponentFixture<CollectionComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
