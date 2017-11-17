import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {BsModalService, ModalModule} from 'ngx-bootstrap';
import {ErrorService} from '../../../services/error.service';
import {HttpClientService} from '../../../services/http/http-client.service';
import {DigitalPrintService} from '../../../services/digital-print/digital-print.service';
import {DigitalPrintDetailsPanelComponent} from '../digital-print-details-panel/digital-print-details-panel.component';
import {DigitalPrintListComponent} from '../digital-print-list/digital-print-list.component';
import { DigitalPrintMasterViewComponent } from './digital-print-master-view.component';
import {DigitalPartMockService} from "../../../services/digital-part/digital-part-mock.service";
import {DigitalPartService} from "../../../services/digital-part/digital-part.service";

describe('DigitalPrintMasterViewComponent', () => {
  let component: DigitalPrintMasterViewComponent;
  let fixture: ComponentFixture<DigitalPrintMasterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule, ModalModule.forRoot() ],
      providers: [HttpClientService],
      declarations: [ DigitalPrintMasterViewComponent, DigitalPrintListComponent, DigitalPrintDetailsPanelComponent ],
    });
    TestBed.overrideComponent(DigitalPrintMasterViewComponent, {
      set: {
        providers: [
          {provide: DigitalPrintService, useClass: DigitalPrintService},
          { provide: DigitalPartService, useClass: DigitalPartMockService },
          {provide: ErrorService, useClass: ErrorService},
          BsModalService,
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalPrintMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
