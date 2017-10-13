import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalPartDetailComponent } from './digital-part-detail.component';

describe('DigitalPartDetailComponent', () => {
  let component: DigitalPartDetailComponent;
  let fixture: ComponentFixture<DigitalPartDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalPartDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalPartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
