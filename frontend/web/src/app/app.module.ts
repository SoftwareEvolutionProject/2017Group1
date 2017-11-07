import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StlViewerComponent } from './components/stl-viewer/stl-viewer.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import { SidebarModule } from 'ng-sidebar';
import {AlertModule, ModalModule} from 'ngx-bootstrap';
import { CustomerDetailPanelComponent } from './components/customer/customer-detail-panel/customer-detail-panel.component';
import { CustomerDetailComponent } from './components/customer/customer-detail/customer-detail.component';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { DigitalPartDetailComponent } from './components/digital-part-detail/digital-part-detail.component';
import { DigitalPartListComponent } from './components/digital-part-list/digital-part-list.component';
import { DigitalPrintDetailComponent } from './components/digital-print-detail/digital-print-detail.component';
import { DigitalPrintListComponent } from './components/digital-print-list/digital-print-list.component';
import { HomeComponent } from './components/home/home.component';
import { MaterialDetailComponent } from './components/material-detail/material-detail.component';
import { MaterialListComponent } from './components/material-list/material-list.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import {HttpClientService} from './services/http/http-client.service';
import { CustomerMasterViewComponent } from './components/customer/customer-master-view/customer-master-view.component';
import { PhysicalPrintMasterViewComponent } from './components/physical-print/physical-print-master-view/physical-print-master-view.component';
import { PhysicalPrintDetailsPanelComponent } from './components/physical-print/physical-print-details-panel/physical-print-details-panel.component';
import { PhysicalPrintEditComponent } from './components/physical-print/physical-print-edit/physical-print-edit.component';
import { PhysicalPrintListComponent } from './components/physical-print/physical-print-list/physical-print-list.component';
import {Error500Component} from "./components/errors/500-error/500-error.component";
import {Error404Component} from "./components/errors/404-error/404-error.component";


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
    OrderDetailComponent,
    OrderListComponent,
    MaterialListComponent,
    MaterialDetailComponent,
    CustomerDetailPanelComponent,
    CustomerMasterViewComponent,
    PhysicalPrintMasterViewComponent,
    PhysicalPrintDetailsPanelComponent,
    PhysicalPrintEditComponent,
    PhysicalPrintListComponent,
    Error404Component,
    Error500Component
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
        component: CustomerMasterViewComponent,
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
        component: HomeComponent,
      },
      {
        path: 'physical-parts/:id',
        component: HomeComponent,
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
        component: PhysicalPrintMasterViewComponent,
      },
      {
        path: 'physical-prints/:id',
        component: PhysicalPrintEditComponent,
      },
      {
        path: 'materials',
        component: MaterialListComponent,
      },
      {
        path: 'materials/:id',
        component: MaterialDetailComponent,
      },
      {
        path: '500',
        component: Error500Component
      },
      {
        path: '404',
        component: Error404Component
      },
    ]),
  ],

  providers: [HttpClientService],
  bootstrap: [AppComponent],
})
export class AppModule { }

