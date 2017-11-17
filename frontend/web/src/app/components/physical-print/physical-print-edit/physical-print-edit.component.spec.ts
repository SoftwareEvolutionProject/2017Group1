import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {BsModalService} from 'ngx-bootstrap';
import {ErrorService} from '../../../services/error.service';
import {HttpClientService} from '../../../services/http/http-client.service';
import {PhysicalPrintMockService} from '../../../services/physical-print/physical-print-mock.service';
import {PhysicalPrintService} from '../../../services/physical-print/physical-print.service';
import {PhysicalPrintEditComponent} from './physical-print-edit.component';
import {DigitalPrintService} from "../../../services/digital-print/digital-print.service";
import {DigitalPrintMockService} from "../../../services/digital-print/digital-print-mock.service";

describe('PhysicalPrintEditComponent', () => {
  let component: PhysicalPrintEditComponent;
  let fixture: ComponentFixture<PhysicalPrintEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule ],
      declarations: [ PhysicalPrintEditComponent ],
    });
    TestBed.overrideComponent(PhysicalPrintEditComponent, {
      set: {
        providers: [
          { provide: PhysicalPrintService, useClass: PhysicalPrintMockService },
          { provide: DigitalPrintService, useClass: DigitalPrintMockService },
          { provide: ErrorService, useClass: ErrorService },
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalPrintEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
