import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalPartDetailPanelComponent } from './digital-part-detail-panel.component';

describe('DigitalPartDetailPanelComponent', () => {
  let component: DigitalPartDetailPanelComponent;
  let fixture: ComponentFixture<DigitalPartDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DigitalPartDetailPanelComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalPartDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should DigitalPartDetailPanelComponent', () => {
    expect(component).toBeTruthy();
  });
});
