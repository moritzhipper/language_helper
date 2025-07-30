import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagicAddComp } from './magic-add-comp';

describe('MagicAddComp', () => {
  let component: MagicAddComp;
  let fixture: ComponentFixture<MagicAddComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagicAddComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagicAddComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
