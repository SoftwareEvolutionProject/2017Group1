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
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

@NgModule({
  declarations: [
    AppComponent,
    StlViewerComponent,
    SidemenuComponent,
    HomeComponent,
    CustomerListComponent,
    CustomerDetailComponent,
  ],
  imports: [
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    BrowserModule,
    SidebarModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    HttpModule,

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
        path: 'customers/:id',
        component: CustomerDetailComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }





