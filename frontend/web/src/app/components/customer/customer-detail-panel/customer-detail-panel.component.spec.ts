import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailPanelComponent } from './customer-detail-panel.component';
import {CustomerService} from '../../../services/customer/customer.service';
import {CustomerMockService} from '../../../services/customer/customer-mock.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('CustomerDetailPanelComponent', () => {
  let component: CustomerDetailPanelComponent;
  let fixture: ComponentFixture<CustomerDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerDetailPanelComponent],
      imports: [RouterTestingModule],
    })
    TestBed.overrideComponent(CustomerDetailPanelComponent, {
      set: {
        providers: [
          { provide: CustomerService, useClass: CustomerMockService },
        ],
      },
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should CustomerDetailPanelComponent', () => {
    expect(component).toBeTruthy();
  });
});
