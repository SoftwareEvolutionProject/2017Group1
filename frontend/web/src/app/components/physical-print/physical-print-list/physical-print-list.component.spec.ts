import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalPrintListComponent } from './physical-print-list.component';

describe('PhysicalPrintListComponent', () => {
  let component: PhysicalPrintListComponent;
  let fixture: ComponentFixture<PhysicalPrintListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalPrintListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalPrintListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should createPhysicalPrint', () => {
    expect(component).toBeTruthy();
  });
});
