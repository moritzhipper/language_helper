import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComp } from './icon-comp';

describe('IconComp', () => {
  let component: IconComp;
  let fixture: ComponentFixture<IconComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
