import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalPrintListComponent } from './digital-print-list.component';

describe('DigitalPrintListComponent', () => {
  let component: DigitalPrintListComponent;
  let fixture: ComponentFixture<DigitalPrintListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalPrintListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalPrintListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should createPhysicalPrint', () => {
    expect(component).toBeTruthy();
  });
});
