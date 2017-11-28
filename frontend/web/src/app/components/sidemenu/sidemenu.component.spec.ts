import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {RouterTestingModule} from '@angular/router/testing';
import { SidemenuComponent } from './sidemenu.component';

describe('SidemenuComponent', () => {
  let component: SidemenuComponent;
  let fixture: ComponentFixture<SidemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidemenuComponent ],
      imports: [RouterTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should createPhysicalPrint', () => {
    expect(component).toBeTruthy();
  });
});
