import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ErrorService} from '../../../services/error.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService, ModalModule } from 'ngx-bootstrap';
import {MaterialMockService} from '../../../services/material/material-mock.service';
import {MaterialService} from '../../../services/material/material.service';
import { MaterialDetailPanelComponent } from '../material-detail-panel/material-detail-panel.component';
import { MaterialListComponent } from './material-list.component';

describe('MaterialListComponent', () => {
  let component: MaterialListComponent;
  let fixture: ComponentFixture<MaterialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialListComponent, MaterialDetailPanelComponent],
      imports: [RouterTestingModule, ModalModule.forRoot()],
    });
    TestBed.overrideComponent(MaterialListComponent, {
      set: {
        providers: [
          { provide: MaterialService, useClass: MaterialMockService },
          { provide: ErrorService, useClass: ErrorService },
          BsModalService,
        ],
      },
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
