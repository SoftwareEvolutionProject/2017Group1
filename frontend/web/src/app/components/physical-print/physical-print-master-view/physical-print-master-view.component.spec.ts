/*
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {BsModalService, ModalModule} from 'ngx-bootstrap';
import {ErrorService} from '../../../services/error.service';
import {HttpClientService} from '../../../services/http/http-client.service';
import {PhysicalPrintMockService} from '../../../services/physical-print/physical-print-mock.service';
import {PhysicalPrintService} from '../../../services/physical-print/physical-print.service';
import {PhysicalPrintDetailsPanelComponent} from '../physical-print-details-panel/physical-print-details-panel.component';
import {PhysicalPrintListComponent} from '../physical-print-list/physical-print-list.component';
import { PhysicalPrintMasterViewComponent } from './physical-print-master-view.component';

describe('PhysicalPrintMasterViewComponent', () => {
  let component: PhysicalPrintMasterViewComponent;
  let fixture: ComponentFixture<PhysicalPrintMasterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule, ModalModule.forRoot() ],
      providers: [HttpClientService],
      declarations: [ PhysicalPrintMasterViewComponent, PhysicalPrintListComponent, PhysicalPrintDetailsPanelComponent ],
    });
    TestBed.overrideComponent(PhysicalPrintMasterViewComponent, {
      set: {
        providers: [
          {provide: PhysicalPrintService, useClass: PhysicalPrintMockService},
          {provide: ErrorService, useClass: ErrorService},
          BsModalService,
        ],
      },
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
*/
