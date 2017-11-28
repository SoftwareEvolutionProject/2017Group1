import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService, ModalModule } from 'ngx-bootstrap';
import { PhysicalPartService } from '../../../services/physical-part/physical-part.service';
import { ErrorService } from '../../../services/error.service';
import { HttpClientService } from '../../../services/http/http-client.service';
import { PhysicalPartDetailPanelComponent } from '../physical-part-detail-panel/physical-part-detail-panel.component';
import { PhysicalPartListComponent} from '../physical-part-list/physical-part-list.component';
import { PhysicalPartMasterViewComponent } from './physical-part-master-view.component';
import { PhysicalPartMockService } from '../../../services/physical-part/physical-part-mock.service';

describe('PhysicalPartMasterViewComponent', () => {
  let component: PhysicalPartMasterViewComponent;
  let fixture: ComponentFixture<PhysicalPartMasterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule, ModalModule.forRoot()],
      providers: [HttpClientService],
      declarations: [ PhysicalPartMasterViewComponent, PhysicalPartListComponent, PhysicalPartDetailPanelComponent ],
    });
    TestBed.overrideComponent(PhysicalPartListComponent, {
      set: {
        providers: [
          {provide: PhysicalPartService, useClass: PhysicalPartMockService},
          {provide: ErrorService, useClass: ErrorService},
          BsModalService,
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
