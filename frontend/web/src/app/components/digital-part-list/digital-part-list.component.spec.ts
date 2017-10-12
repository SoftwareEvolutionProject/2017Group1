import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalPartListComponent } from './digital-part-list.component';

describe('DigitalPartListComponent', () => {
  let component: DigitalPartListComponent;
  let fixture: ComponentFixture<DigitalPartListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalPartListComponent ]
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
