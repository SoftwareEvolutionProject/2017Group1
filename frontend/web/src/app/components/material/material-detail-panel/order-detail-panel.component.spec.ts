import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDetailPanelComponent } from './material-detail-panel.component';
import {MaterialService} from '../../../services/material/material.service';
import {MaterialMockService} from '../../../services/material/material-mock.service';
import {RouterTestingModule} from '@angular/router/testing';
import {CustomerMockService} from '../../../services/customer/customer-mock.service';
import {CustomerService} from '../../../services/customer/customer.service';

describe('MaterialDetailPanelComponent', () => {
  let component: MaterialDetailPanelComponent;
  let fixture: ComponentFixture<MaterialDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialDetailPanelComponent],
      imports: [RouterTestingModule],
    })
    TestBed.overrideComponent(MaterialDetailPanelComponent, {
      set: {
        providers: [
          { provide: CustomerService, useClass: CustomerMockService },
          { provide: MaterialService, useClass: MaterialMockService },
        ],
      },
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should MaterialDetailPanelComponent', () => {
    expect(component).toBeTruthy();
  });
});

