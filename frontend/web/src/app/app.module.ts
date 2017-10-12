import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StlViewerComponent } from './components/stl-viewer/stl-viewer.component';

import { SidebarModule } from 'ng-sidebar';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import {RouterModule} from "@angular/router";
import { HomeComponent } from './components/home/home.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import {AlertModule, ModalModule} from "ngx-bootstrap";
import { DigitalPartListComponent } from './components/digital-part-list/digital-part-list.component';

@NgModule({
  declarations: [
    AppComponent,
    StlViewerComponent,
    SidemenuComponent,
    HomeComponent,
    CustomerListComponent,
    DigitalPartListComponent,
  ],
  imports: [
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    BrowserModule,
    SidebarModule.forRoot(),

    RouterModule.forRoot([
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'customers',
        component: CustomerListComponent,
      },
      {
        path: 'digital-parts',
        component: DigitalPartListComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
