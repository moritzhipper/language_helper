import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCollectionComp } from './shared-collection-comp';

describe('SharedCollectionComp', () => {
  let component: SharedCollectionComp;
  let fixture: ComponentFixture<SharedCollectionComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedCollectionComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedCollectionComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
