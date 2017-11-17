import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalPrintDetailsPanelComponent } from './digital-print-details-panel.component';
import {DigitalPartMockService} from "../../../services/digital-part/digital-part-mock.service";
import {DigitalPartService} from "../../../services/digital-part/digital-part.service";

describe('DigitalPrintDetailsPanelComponent', () => {
  let component: DigitalPrintDetailsPanelComponent;
  let fixture: ComponentFixture<DigitalPrintDetailsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalPrintDetailsPanelComponent ]
    })
    TestBed.overrideComponent(DigitalPrintDetailsPanelComponent, {
      set: {
        providers: [
          { provide: DigitalPartService, useClass: DigitalPartMockService },
        ],
      },
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
