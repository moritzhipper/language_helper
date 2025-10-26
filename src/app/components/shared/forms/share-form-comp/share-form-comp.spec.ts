import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareFormComp } from './share-form-comp';

describe('ShareFormComp', () => {
  let component: ShareFormComp;
  let fixture: ComponentFixture<ShareFormComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareFormComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareFormComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
