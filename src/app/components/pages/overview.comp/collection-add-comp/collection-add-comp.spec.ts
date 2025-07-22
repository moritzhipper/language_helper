import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionAddComp } from './collection-add-comp';

describe('CollectionAddComp', () => {
  let component: CollectionAddComp;
  let fixture: ComponentFixture<CollectionAddComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionAddComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionAddComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
