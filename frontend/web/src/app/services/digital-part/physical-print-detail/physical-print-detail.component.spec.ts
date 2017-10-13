import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalPrintDetailComponent } from './physical-print-detail.component';

describe('PhysicalPrintDetailComponent', () => {
  let component: PhysicalPrintDetailComponent;
  let fixture: ComponentFixture<PhysicalPrintDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalPrintDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalPrintDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
