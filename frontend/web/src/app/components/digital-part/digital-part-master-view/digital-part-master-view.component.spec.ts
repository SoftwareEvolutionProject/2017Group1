import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {RouterTestingModule} from '@angular/router/testing';
import {BsModalService, ModalModule} from 'ngx-bootstrap';
import {DigitalPartService} from '../../../services/digital-part/digital-part.service';
import {ErrorService} from '../../../services/error.service';
import {HttpClientService} from '../../../services/http/http-client.service';
import {DigitalPartDetailPanelComponent} from '../digital-part-detail-panel/digital-part-detail-panel.component';
import {DigitalPartListComponent} from '../digital-part-list/digital-part-list.component';
import { DigitalPartMasterViewComponent } from './digital-part-master-view.component';
import {CustomerService} from "../../../services/customer/customer.service";
import {CustomerMockService} from "../../../services/customer/customer-mock.service";
import {DigitalPartMockService} from "../../../services/digital-part/digital-part-mock.service";
import {HttpModule} from "@angular/http";

describe('DigtialPartMasterViewComponent', () => {
  let component: DigitalPartMasterViewComponent;
  let fixture: ComponentFixture<DigitalPartMasterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, ModalModule.forRoot()],
      providers: [HttpClientService],
      declarations: [ DigitalPartMasterViewComponent, DigitalPartListComponent, DigitalPartDetailPanelComponent ],
    });
    TestBed.overrideComponent(DigitalPartMasterViewComponent, {
      set: {
        providers: [
          {provide: DigitalPartService, useClass: DigitalPartMockService},
          {provide: CustomerService, useClass: CustomerMockService},
          {provide: ErrorService, useClass: ErrorService},
          BsModalService,
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalPartMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create DigtialPartMasterViewComponent', () => {
    expect(component).toBeTruthy();
  });
});
