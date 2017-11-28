/*
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {ErrorService} from '../../../services/error.service';
import {DigitalPrintService} from '../../../services/digital-print/digital-print.service';
import {DigitalPrintEditComponent} from './digital-print-edit.component';
import {DigitalPartMockService} from '../../../services/digital-part/digital-part-mock.service';
import {DigitalPartService} from "../../../services/digital-part/digital-part.service";
import {DigitalPrintMockService} from "../../../services/digital-print/digital-print-mock.service";

describe('DigitalPrintEditComponent', () => {
  let component: DigitalPrintEditComponent;
  let fixture: ComponentFixture<DigitalPrintEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule ],
      declarations: [ DigitalPrintEditComponent ],
    });
    TestBed.overrideComponent(DigitalPrintEditComponent, {
      set: {
        providers: [
          { provide: DigitalPartService, useClass: DigitalPartMockService },
          { provide: DigitalPrintService, useClass: DigitalPrintMockService },
          { provide: ErrorService, useClass: ErrorService },
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalPrintEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/
