import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCollectionComp } from './delete-collection-comp';

describe('DeleteCollectionComp', () => {
  let component: DeleteCollectionComp;
  let fixture: ComponentFixture<DeleteCollectionComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCollectionComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCollectionComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
