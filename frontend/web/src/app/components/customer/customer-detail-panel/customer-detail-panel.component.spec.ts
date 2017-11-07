import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailPanelComponent } from './customer-detail-panel.component';

describe('CustomerDetailPanelComponent', () => {
  let component: CustomerDetailPanelComponent;
  let fixture: ComponentFixture<CustomerDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDetailPanelComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should CustomerDetailPanelComponent', () => {
    expect(component).toBeTruthy();
  });
});
