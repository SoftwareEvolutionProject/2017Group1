import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StlViewerComponent } from './stl-viewer.component';

describe('StlViewerComponent', () => {
  let component: StlViewerComponent;
  let fixture: ComponentFixture<StlViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StlViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StlViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
