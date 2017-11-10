import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalPartListComponent } from './physical-part-list.component';

describe('PhysicalPartListComponent', () => {
  let component: PhysicalPartListComponent;
  let fixture: ComponentFixture<PhysicalPartListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalPartListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalPartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
