import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailComponent } from './customer-detail.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {CustomerMockService} from "../../services/customer/customer-mock.service";
import {BsModalService} from "ngx-bootstrap";
import {ErrorService} from "../../services/error.service";
import {CustomerService} from "../../services/customer/customer.service";

describe('CustomerDetailComponent', () => {
  let component: CustomerDetailComponent;
  let fixture: ComponentFixture<CustomerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDetailComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule]
    });
    TestBed.overrideComponent(CustomerDetailComponent, {
      set: {
        providers: [
          {provide: CustomerService, useClass: CustomerMockService},
          {provide: ErrorService, useClass: ErrorService},
          BsModalService,
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
