import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService, ModalModule } from 'ngx-bootstrap';
import {OrderMockService} from '../../../services/order/order-mock.service';
import {OrderService} from '../../../services/order/order.service';
import {ErrorService} from '../../../services/error.service';
import { OrderDetailPanelComponent } from '../order-detail-panel/order-detail-panel.component';
import { OrderListComponent } from './order-list.component';
import {CalendarModule} from "primeng/primeng";
import {CustomerService} from "../../../services/customer/customer.service";
import {CustomerMockService} from "../../../services/customer/customer-mock.service";

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderListComponent, OrderDetailPanelComponent],
      imports: [RouterTestingModule, ModalModule.forRoot(), CalendarModule],
    });
    TestBed.overrideComponent(OrderListComponent, {
      set: {
        providers: [
          { provide: CustomerService, useClass: CustomerMockService },
          { provide: OrderService, useClass: OrderMockService },
          { provide: ErrorService, useClass: ErrorService },
          BsModalService,
        ],
      },
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
