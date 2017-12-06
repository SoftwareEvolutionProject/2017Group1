import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {BsModalService, ComponentLoaderFactory, PositioningService} from 'ngx-bootstrap';
import {MaterialMockService} from '../../../services/material/material-mock.service';
import {MaterialService} from '../../../services/material/material.service';
import {ErrorService} from '../../../services/error.service';
import {MaterialEditComponent} from './material-edit.component';
import {CustomerService} from '../../../services/customer/customer.service';
import {CustomerMockService} from '../../../services/customer/customer-mock.service';
import {DigitalPartMockService} from '../../../services/digital-part/digital-part-mock.service';
import {DigitalPartService} from '../../../services/digital-part/digital-part.service';
import {CalendarModule} from 'primeng/primeng';
import {CustomerDetailComponent} from '../../customer/customer-detail/customer-detail.component';

describe('MaterialEditComponent', () => {
  let component: MaterialEditComponent;
  let fixture: ComponentFixture<MaterialEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialEditComponent, CustomerDetailComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, CalendarModule],
    });
    TestBed.overrideComponent(MaterialEditComponent, {
      set: {
        providers: [
          ComponentLoaderFactory,
          PositioningService,
          { provide: MaterialService, useClass: MaterialMockService },
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
    fixture = TestBed.createComponent(MaterialEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
