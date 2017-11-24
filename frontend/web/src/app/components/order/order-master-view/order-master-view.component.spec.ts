import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ErrorService} from '../../../services/error.service';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {ModalModule} from 'ngx-bootstrap';
import {OrderService} from '../../../services/order/order.service';
import {HttpClientService} from '../../../services/http/http-client.service';
import {OrderDetailPanelComponent} from '../order-detail-panel/order-detail-panel.component';
import {OrderListComponent} from '../order-list/order-list.component';
import { OrderMasterViewComponent } from './order-master-view.component';

describe('OrderMasterViewComponent', () => {
  let component: OrderMasterViewComponent;
  let fixture: ComponentFixture<OrderMasterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, ModalModule.forRoot()],
      providers: [HttpClientService],
      declarations: [ OrderMasterViewComponent, OrderListComponent, OrderDetailPanelComponent ],
    });
    TestBed.overrideComponent(OrderListComponent, {
      set: {
        providers: [
          {provide: OrderService, useClass: OrderService},
          {provide: ErrorService, useClass: ErrorService},
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create OrderMasterViewComponent', () => {
    expect(component).toBeTruthy();
  });
});
