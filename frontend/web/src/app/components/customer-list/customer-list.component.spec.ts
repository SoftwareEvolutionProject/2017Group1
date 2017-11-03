import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {RouterTestingModule} from '@angular/router/testing';
import {BsModalService, ModalModule} from 'ngx-bootstrap';
import {CustomerMockService} from '../../services/customer/customer-mock.service';
import {CustomerService} from '../../services/customer/customer.service';
import {ErrorService} from '../../services/error.service';
import {CustomerDetailPanelComponent} from '../customer-detail-panel/customer-detail-panel.component';
import { CustomerListComponent } from './customer-list.component';

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerListComponent, CustomerDetailPanelComponent ],
      imports: [RouterTestingModule, ModalModule.forRoot()],
    });
    TestBed.overrideComponent(CustomerListComponent, {
      set: {
        providers: [
          {provide: CustomerService, useClass: CustomerMockService},
          {provide: ErrorService, useClass: ErrorService},
          BsModalService,
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
