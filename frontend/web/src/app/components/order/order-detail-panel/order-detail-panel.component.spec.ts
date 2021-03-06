import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailPanelComponent } from './order-detail-panel.component';
import {OrderService} from '../../../services/order/order.service';
import {OrderMockService} from '../../../services/order/order-mock.service';
import {RouterTestingModule} from '@angular/router/testing';
import {CustomerMockService} from '../../../services/customer/customer-mock.service';
import {CustomerService} from '../../../services/customer/customer.service';

describe('OrderDetailPanelComponent', () => {
  let component: OrderDetailPanelComponent;
  let fixture: ComponentFixture<OrderDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDetailPanelComponent],
      imports: [RouterTestingModule],
    })
    TestBed.overrideComponent(OrderDetailPanelComponent, {
      set: {
        providers: [
          { provide: CustomerService, useClass: CustomerMockService },
          { provide: OrderService, useClass: OrderMockService },
        ],
      },
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should OrderDetailPanelComponent', () => {
    expect(component).toBeTruthy();
  });
});

