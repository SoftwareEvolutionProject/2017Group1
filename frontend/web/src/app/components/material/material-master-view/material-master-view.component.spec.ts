import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ErrorService} from '../../../services/error.service';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {ModalModule} from 'ngx-bootstrap';
import {MaterialService} from '../../../services/material/material.service';
import {HttpClientService} from '../../../services/http/http-client.service';
import {MaterialDetailPanelComponent} from '../material-detail-panel/material-detail-panel.component';
import {MaterialListComponent} from '../material-list/material-list.component';
import { MaterialMasterViewComponent } from './material-master-view.component';

describe('MaterialMasterViewComponent', () => {
  let component: MaterialMasterViewComponent;
  let fixture: ComponentFixture<MaterialMasterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, ModalModule.forRoot()],
      providers: [HttpClientService],
      declarations: [ MaterialMasterViewComponent, MaterialListComponent, MaterialDetailPanelComponent],
    });
    TestBed.overrideComponent(MaterialListComponent, {
      set: {
        providers: [
          {provide: MaterialService, useClass: MaterialService},
          {provide: ErrorService, useClass: ErrorService},
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create MaterialMasterViewComponent', () => {
    expect(component).toBeTruthy();
  });
});
