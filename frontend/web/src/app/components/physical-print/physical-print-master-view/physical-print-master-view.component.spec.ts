import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalPrintMasterViewComponent } from './physical-print-master-view.component';

describe('PhysicalPrintMasterViewComponent', () => {
  let component: PhysicalPrintMasterViewComponent;
  let fixture: ComponentFixture<PhysicalPrintMasterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalPrintMasterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalPrintMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
