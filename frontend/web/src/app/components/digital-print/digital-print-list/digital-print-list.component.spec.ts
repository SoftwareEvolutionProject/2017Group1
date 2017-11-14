import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {BsModalService, ModalModule} from 'ngx-bootstrap';
import {ErrorService} from '../../../services/error.service';
import {HttpClientService} from '../../../services/http/http-client.service';
import {DigitalPrintService} from '../../../services/digital-print/digital-print.service';
import {DigitalPrintDetailsPanelComponent} from '../digital-print-details-panel/digital-print-details-panel.component';
import {DigitalPrintEditComponent} from '../digital-print-edit/digital-print-edit.component';
import { DigitalPrintListComponent } from './digital-print-list.component';
import {DigitalPartMockService} from "../../../services/digital-part/digital-part-mock.service";

describe('DigitalPrintListComponent', () => {
  let component: DigitalPrintListComponent;
  let fixture: ComponentFixture<DigitalPrintListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalPrintListComponent, DigitalPrintDetailsPanelComponent ],
      providers: [HttpClientService],
      imports: [HttpModule, RouterTestingModule, ModalModule.forRoot()],
    });
    TestBed.overrideComponent(DigitalPrintEditComponent, {
      set: {
        providers: [
          { provide: DigitalPrintService, useClass: DigitalPrintService },
          { provide: DigitalPartMockService, useClass: DigitalPartMockService },
          { provide: ErrorService, useClass: ErrorService },
          BsModalService,
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalPrintListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should createDigitalPrintList', () => {
    expect(component).toBeTruthy();
  });
});
