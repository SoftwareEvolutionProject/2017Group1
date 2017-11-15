import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService, ModalModule } from 'ngx-bootstrap';
import {PhysicalPartMockService} from '../../../services/physical-part/physical-part-mock.service';
import {PhysicalPartService} from '../../../services/physical-part/physical-part.service';
import {ErrorService} from '../../../services/error.service';
import { PhysicalPartDetailPanelComponent } from '../physical-part-detail-panel/physical-part-detail-panel.component';
import { PhysicalPartListComponent } from './physical-part-list.component';

describe('PhysicalPartListComponent', () => {
  let component: PhysicalPartListComponent;
  let fixture: ComponentFixture<PhysicalPartListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicalPartListComponent, PhysicalPartDetailPanelComponent],
      imports: [RouterTestingModule, ModalModule.forRoot()],
    });
    TestBed.overrideComponent(PhysicalPartListComponent, {
      set: {
        providers: [
          { provide: PhysicalPartService, useClass: PhysicalPartMockService },
          { provide: ErrorService, useClass: ErrorService },
          BsModalService,
        ],
      },
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalPartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
