import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCollectionComp } from './edit-collection-comp';

describe('EditCollectionComp', () => {
  let component: EditCollectionComp;
  let fixture: ComponentFixture<EditCollectionComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCollectionComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCollectionComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
