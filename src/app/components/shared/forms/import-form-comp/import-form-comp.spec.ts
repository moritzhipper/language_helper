import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFormComp } from './import-form-comp';

describe('ImportFormComp', () => {
  let component: ImportFormComp;
  let fixture: ComponentFixture<ImportFormComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportFormComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportFormComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
