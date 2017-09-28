import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StlViewerComponent } from './stl-viewer/stl-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    StlViewerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
