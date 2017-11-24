import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap';
import { PhysicalPartMockService } from '../../../services/physicalPart/physical-part-mock.service';
import { PhysicalPartService } from '../../../services/physicalPart/physical-part.service';
import { ErrorService } from '../../../services/error.service';
import { PhysicalPartDetailPanelComponent } from './physical-part-detail-panel.component';

describe('PhysicalPartDetailPanelComponent', () => {
  let component: PhysicalPartDetailPanelComponent;
  let fixture: ComponentFixture<PhysicalPartDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicalPartDetailPanelComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
    });
    TestBed.overrideComponent(PhysicalPartDetailPanelComponent, {
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
    fixture = TestBed.createComponent(PhysicalPartDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
