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
import { DigitalPartListComponent } from './components/digital-part-list/digital-part-list.component';
import { DigitalPartDetailComponent } from './components/digital-part-detail/digital-part-detail.component';
import { DigitalPrintListComponent } from './components/digital-print-list/digital-print-list.component';
import { DigitalPrintDetailComponent } from './components/digital-print-detail/digital-print-detail.component';
import { PhysicalPrintDetailComponent } from './components/physical-print-detail/physical-print-detail.component';
import { PhysicalPrintListComponent } from './components/physical-print-list/physical-print-list.component';
import { PhysicalPartDetailComponent } from './components/physical-part-detail/physical-part-detail.component';
import { PhysicalPartListComponent } from './components/physical-part-list/physical-part-list.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { MaterialListComponent } from './components/material-list/material-list.component';
import { MaterialDetailComponent } from './components/material-detail/material-detail.component';
import {HttpClientService} from "./services/http/http-client.service";
import { CustomerDetailPanelComponent } from './components/customer-detail-panel/customer-detail-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    StlViewerComponent,
    SidemenuComponent,
    HomeComponent,
    CustomerListComponent,
    CustomerDetailComponent,
    DigitalPartListComponent,
    DigitalPartDetailComponent,
    DigitalPrintListComponent,
    DigitalPrintDetailComponent,
    PhysicalPrintDetailComponent,
    PhysicalPrintListComponent,
    PhysicalPartDetailComponent,
    PhysicalPartListComponent,
    OrderDetailComponent,
    OrderListComponent,
    MaterialListComponent,
    MaterialDetailComponent,
    CustomerDetailPanelComponent,
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
      {
        path: 'orders',
        component: OrderListComponent,
      },
      {
        path: 'orders/:id',
        component: OrderDetailComponent,
      },
      {
        path: 'digital-parts',
        component: DigitalPartListComponent,
      },
      {
        path: 'digital-parts/:id',
        component: DigitalPartDetailComponent,
      },
      {
        path: 'physical-parts',
        component: PhysicalPartListComponent,
      },
      {
        path: 'physical-parts/:id',
        component: PhysicalPartDetailComponent,
      },
      {
        path: 'digital-prints',
        component: DigitalPrintListComponent,
      },
      {
        path: 'digital-prints/:id',
        component: DigitalPrintDetailComponent,
      },
      {
        path: 'physical-prints',
        component: PhysicalPrintListComponent,
      },
      {
        path: 'physical-prints/:id',
        component: PhysicalPrintDetailComponent,
      },
      {
        path: 'materials',
        component: MaterialListComponent,
      },
      {
        path: 'materials/:id',
        component: MaterialDetailComponent,
      },
    ]),
  ],

  providers: [HttpClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }





