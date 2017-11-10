import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {ModalModule} from 'ngx-bootstrap';
import {CustomerService} from '../../../services/customer/customer.service';
import {ErrorService} from '../../../services/error.service';
import {HttpClientService} from '../../../services/http/http-client.service';
import {CustomerDetailPanelComponent} from '../customer-detail-panel/customer-detail-panel.component';
import {CustomerListComponent} from '../customer-list/customer-list.component';
import { CustomerMasterViewComponent } from './customer-master-view.component';

describe('CustomerMasterViewComponent', () => {
  let component: CustomerMasterViewComponent;
  let fixture: ComponentFixture<CustomerMasterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, ModalModule.forRoot()],
      providers: [HttpClientService],
      declarations: [ CustomerMasterViewComponent, CustomerListComponent, CustomerDetailPanelComponent ],
    });
    TestBed.overrideComponent(CustomerListComponent, {
      set: {
        providers: [
          {provide: CustomerService, useClass: CustomerService},
          {provide: ErrorService, useClass: ErrorService},
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create CustomerMasterViewComponent', () => {
    expect(component).toBeTruthy();
  });
});
