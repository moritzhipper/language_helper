import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBubblesComp } from './edit-bubbles-comp';

describe('EditBubblesComp', () => {
  let component: EditBubblesComp;
  let fixture: ComponentFixture<EditBubblesComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBubblesComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBubblesComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
