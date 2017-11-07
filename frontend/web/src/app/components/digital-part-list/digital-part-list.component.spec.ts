import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService, ModalModule } from 'ngx-bootstrap';
import { DigitalPartMockService } from '../../services/digital-part/digital-part-mock.service';
import { ErrorService } from '../../services/error.service';
import { DigitalPartListComponent } from './digital-part-list.component';

describe('DigitalPartListComponent', () => {
  let component: DigitalPartListComponent;
  let fixture: ComponentFixture<DigitalPartListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DigitalPartListComponent],
      imports: [RouterTestingModule, ModalModule.forRoot()],
    });

    TestBed.overrideComponent(DigitalPartListComponent, {
      set: {
        providers: [
          { provide: DigitalPartMockService, useClass: DigitalPartMockService },
          { provide: ErrorService, useClass: ErrorService },
          BsModalService,
        ],
      },
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalPartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
