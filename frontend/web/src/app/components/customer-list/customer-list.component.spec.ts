import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerListComponent } from './customer-list.component';
import {RouterTestingModule} from "@angular/router/testing";
import {BsModalService, ModalModule} from "ngx-bootstrap";
import {ErrorService} from "../../services/error.service";
import {CustomerMockService} from "../../services/customer/customer-mock.service";

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerListComponent ],
      imports: [RouterTestingModule, ModalModule.forRoot()]
    });
    TestBed.overrideComponent(CustomerListComponent, {
      set: {
        providers: [
          {provide: CustomerMockService, useClass: CustomerMockService},
          {provide: ErrorService, useClass: ErrorService},
          BsModalService,
        ]
      }
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
