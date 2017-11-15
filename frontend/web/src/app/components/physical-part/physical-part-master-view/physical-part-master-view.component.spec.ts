import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {ModalModule} from 'ngx-bootstrap';
import {PhysicalPartService} from '../../../services/physical-part/physical-part.service';
import {ErrorService} from '../../../services/error.service';
import {HttpClientService} from '../../../services/http/http-client.service';
import {PhysicalPartDetailPanelComponent} from '../physical-part-detail-panel/physical-part-detail-panel.component';
import {PhysicalPartListComponent} from '../physical-part-list/physical-part-list.component';
import { PhysicalPartMasterViewComponent } from './physical-part-master-view.component';

describe('PhysicalPartMasterViewComponent', () => {
  let component: PhysicalPartMasterViewComponent;
  let fixture: ComponentFixture<PhysicalPartMasterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, ModalModule.forRoot()],
      providers: [HttpClientService],
      declarations: [ PhysicalPartMasterViewComponent, PhysicalPartListComponent, PhysicalPartDetailPanelComponent ],
    });
    TestBed.overrideComponent(PhysicalPartListComponent, {
      set: {
        providers: [
          {provide: PhysicalPartService, useClass: PhysicalPartService},
          {provide: ErrorService, useClass: ErrorService},
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalPartMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create PhysicalPartMasterViewComponent', () => {
    expect(component).toBeTruthy();
  });
});
