import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalPrintDetailsPanelComponent } from './physical-print-details-panel.component';

describe('PhysicalPrintDetailsPanelComponent', () => {
  let component: PhysicalPrintDetailsPanelComponent;
  let fixture: ComponentFixture<PhysicalPrintDetailsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalPrintDetailsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalPrintDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
