import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap';
import {OrderMockService} from '../../../services/order/order-mock.service';
import {OrderService} from '../../../services/order/order.service';
import {ErrorService} from '../../../services/error.service';
import {OrderEditComponent} from './order-edit.component';
import {CustomerService} from '../../../services/customer/customer.service';
import {CustomerMockService} from '../../../services/customer/customer-mock.service';
import {DigitalPartMockService} from '../../../services/digital-part/digital-part-mock.service';
import {DigitalPartService} from '../../../services/digital-part/digital-part.service';
import {CalendarModule} from "primeng/primeng";

describe('OrderEditComponent', () => {
  let component: OrderEditComponent;
  let fixture: ComponentFixture<OrderEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderEditComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, CalendarModule],
    });
    TestBed.overrideComponent(OrderEditComponent, {
      set: {
        providers: [
          { provide: OrderService, useClass: OrderMockService },
          { provide: CustomerService, useClass: CustomerMockService },
          { provide: DigitalPartService, useClass: DigitalPartMockService },
          { provide: ErrorService, useClass: ErrorService },
          BsModalService,
        ],
      },
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
