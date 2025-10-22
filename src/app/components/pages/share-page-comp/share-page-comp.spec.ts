import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePageComp } from './share-page-comp';

describe('SharePageComp', () => {
  let component: SharePageComp;
  let fixture: ComponentFixture<SharePageComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharePageComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharePageComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
