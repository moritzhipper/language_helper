import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoolHeaderComp } from './cool-header-comp';

describe('CoolHeaderComp', () => {
  let component: CoolHeaderComp;
  let fixture: ComponentFixture<CoolHeaderComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoolHeaderComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoolHeaderComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
