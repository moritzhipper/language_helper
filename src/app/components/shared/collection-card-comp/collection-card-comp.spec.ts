import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionCardComp } from './collection-card-comp';

describe('CollectionCardComp', () => {
  let component: CollectionCardComp;
  let fixture: ComponentFixture<CollectionCardComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionCardComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionCardComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
