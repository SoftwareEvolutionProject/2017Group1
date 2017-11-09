import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalPartDetailComponent } from './physical-part-detail.component';

describe('PhysicalPartDetailComponent', () => {
  let component: PhysicalPartDetailComponent;
  let fixture: ComponentFixture<PhysicalPartDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalPartDetailComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalPartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
