import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalPrintDetailsPanelComponent } from './digital-print-details-panel.component';
import {DigitalPartMockService} from "../../../services/digital-part/digital-part-mock.service";
import {DigitalPartService} from "../../../services/digital-part/digital-part.service";
import {DigitalPartDetailPanelComponent} from "../../digital-part/digital-part-detail-panel/digital-part-detail-panel.component";
import {StlViewerComponent} from "../../stl-viewer/stl-viewer.component";

describe('DigitalPrintDetailsPanelComponent', () => {
  let component: DigitalPrintDetailsPanelComponent;
  let fixture: ComponentFixture<DigitalPrintDetailsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalPrintDetailsPanelComponent, DigitalPartDetailPanelComponent, StlViewerComponent ]
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
