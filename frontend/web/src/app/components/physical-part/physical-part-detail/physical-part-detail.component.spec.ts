import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap';
import {PhysicalPartMockService} from '../../../services/physicalPart/physical-part-mock.service';
import {PhysicalPartService} from '../../../services/physicalPart/physical-part.service';
import {ErrorService} from '../../../services/error.service';
import { PhysicalPartDetailComponent } from './physical-part-detail.component';

describe('PhysicalPartDetailComponent', () => {
  let component: PhysicalPartDetailComponent;
  let fixture: ComponentFixture<PhysicalPartDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicalPartDetailComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
    });
    TestBed.overrideComponent(PhysicalPartDetailComponent, {
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
    fixture = TestBed.createComponent(PhysicalPartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
