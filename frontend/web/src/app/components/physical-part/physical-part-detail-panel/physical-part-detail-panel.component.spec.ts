import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalPartDetailPanelComponent } from './physical-part-detail-panel.component';

describe('PhysicalPartDetailPanelComponent', () => {
  let component: PhysicalPartDetailPanelComponent;
  let fixture: ComponentFixture<PhysicalPartDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicalPartDetailPanelComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalPartDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should PhysicalPartDetailPanelComponent', () => {
    expect(component).toBeTruthy();
  });
});
