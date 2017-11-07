import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalPrintEditComponent } from './physical-print-edit.component';

describe('PhysicalPrintEditComponent', () => {
  let component: PhysicalPrintEditComponent;
  let fixture: ComponentFixture<PhysicalPrintEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalPrintEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalPrintEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
