import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMasterViewComponent } from './customer-master-view.component';

describe('CustomerMasterViewComponent', () => {
  let component: CustomerMasterViewComponent;
  let fixture: ComponentFixture<CustomerMasterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMasterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
