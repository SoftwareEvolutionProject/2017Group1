import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDetailComponent } from './material-detail.component';

describe('MaterialDetailComponent', () => {
  let component: MaterialDetailComponent;
  let fixture: ComponentFixture<MaterialDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
