import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {ModalModule} from 'ngx-bootstrap';
import {DigitalPartService} from '../../../services/digital-part/digital-part.service';
import {ErrorService} from '../../../services/error.service';
import {HttpClientService} from '../../../services/http/http-client.service';
import {DigitalPartDetailPanelComponent} from '../digital-part-detail-panel/digital-part-detail-panel.component';
import {DigitalPartListComponent} from '../digital-part-list/digital-part-list.component';
import { DigitalPartMasterViewComponent } from './digital-part-master-view.component';

describe('DigtialPartMasterViewComponent', () => {
  let component: DigitalPartMasterViewComponent;
  let fixture: ComponentFixture<DigitalPartMasterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, ModalModule.forRoot()],
      providers: [HttpClientService],
      declarations: [ DigitalPartMasterViewComponent, DigitalPartListComponent, DigitalPartDetailPanelComponent ],
    });
    TestBed.overrideComponent(DigitalPartListComponent, {
      set: {
        providers: [
          {provide: DigitalPartService, useClass: DigitalPartService},
          {provide: ErrorService, useClass: ErrorService},
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalPartMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create DigtialPartMasterViewComponent', () => {
    expect(component).toBeTruthy();
  });
});
