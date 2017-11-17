/*
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {BsModalService, ModalModule} from 'ngx-bootstrap';
import {ErrorService} from '../../../services/error.service';
import {HttpClientService} from '../../../services/http/http-client.service';
import {PhysicalPrintMockService} from '../../../services/physical-print/physical-print-mock.service';
import {PhysicalPrintService} from '../../../services/physical-print/physical-print.service';
import {PhysicalPrintDetailsPanelComponent} from '../physical-print-details-panel/physical-print-details-panel.component';
import {PhysicalPrintEditComponent} from '../physical-print-edit/physical-print-edit.component';
import { PhysicalPrintListComponent } from './physical-print-list.component';

describe('PhysicalPrintListComponent', () => {
  let component: PhysicalPrintListComponent;
  let fixture: ComponentFixture<PhysicalPrintListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalPrintListComponent, PhysicalPrintDetailsPanelComponent ],
      providers: [HttpClientService],
      imports: [HttpModule, RouterTestingModule, ModalModule.forRoot()],
    });
    TestBed.overrideComponent(PhysicalPrintEditComponent, {
      set: {
        providers: [
          { provide: PhysicalPrintService, useClass: PhysicalPrintMockService },
          { provide: ErrorService, useClass: ErrorService },
          BsModalService,
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalPrintListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should createPhysicalPrintList', () => {
    expect(component).toBeTruthy();
  });
});
*/
