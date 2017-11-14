import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {ErrorService} from '../../../services/error.service';
import {DigitalPrintService} from '../../../services/digital-print/digital-print.service';
import {DigitalPrintEditComponent} from './digital-print-edit.component';

describe('DigitalPrintEditComponent', () => {
  let component: DigitalPrintEditComponent;
  let fixture: ComponentFixture<DigitalPrintEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule ],
      declarations: [ DigitalPrintEditComponent ],
    });
    TestBed.overrideComponent(DigitalPrintEditComponent, {
      set: {
        providers: [
          { provide: DigitalPrintService, useClass: DigitalPrintService },
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
