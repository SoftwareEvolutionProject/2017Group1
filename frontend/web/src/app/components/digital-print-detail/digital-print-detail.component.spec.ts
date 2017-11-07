import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalPrintDetailComponent } from './digital-print-detail.component';

describe('DigitalPrintDetailComponent', () => {
  let component: DigitalPrintDetailComponent;
  let fixture: ComponentFixture<DigitalPrintDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalPrintDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalPrintDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should createPhysicalPrint', () => {
    expect(component).toBeTruthy();
  });
});
