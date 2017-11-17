import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalPrintDetailsPanelComponent } from './digital-print-details-panel.component';

describe('DigitalPrintDetailsPanelComponent', () => {
  let component: DigitalPrintDetailsPanelComponent;
  let fixture: ComponentFixture<DigitalPrintDetailsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalPrintDetailsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalPrintDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
