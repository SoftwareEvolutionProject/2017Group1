import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {StlViewerComponent} from "./components/stl-viewer/stl-viewer.component";
import {SidemenuComponent} from "./components/sidemenu/sidemenu.component";
import {RouterTestingModule} from "@angular/router/testing";

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        StlViewerComponent,
        SidemenuComponent,
      ],imports: [
        RouterTestingModule
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
});
