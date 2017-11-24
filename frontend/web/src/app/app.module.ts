import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StlViewerComponent } from './components/stl-viewer/stl-viewer.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'ng-sidebar';
import { AlertModule, ModalModule } from 'ngx-bootstrap';
import { DropdownModule } from 'primeng/primeng';
import { CustomerDetailPanelComponent } from './components/customer/customer-detail-panel/customer-detail-panel.component';
import { CustomerDetailComponent } from './components/customer/customer-detail/customer-detail.component';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { CustomerMasterViewComponent } from './components/customer/customer-master-view/customer-master-view.component';
import { DigitalPartDetailPanelComponent } from './components/digital-part/digital-part-detail-panel/digital-part-detail-panel.component';
import { DigitalPartEditComponent } from './components/digital-part/digital-part-edit/digital-part-edit.component';
import { DigitalPartListComponent } from './components/digital-part/digital-part-list/digital-part-list.component';
import { DigitalPartMasterViewComponent } from './components/digital-part/digital-part-master-view/digital-part-master-view.component';
import { DigitalPrintDetailsPanelComponent } from './components/digital-print/digital-print-details-panel/digital-print-details-panel.component';
import { DigitalPrintEditComponent } from './components/digital-print/digital-print-edit/digital-print-edit.component';
import { DigitalPrintListComponent } from './components/digital-print/digital-print-list/digital-print-list.component';
import { DigitalPrintMasterViewComponent } from './components/digital-print/physical-print-master-view/digital-print-master-view.component';
import { HomeComponent } from './components/home/home.component';
import { MaterialDetailComponent } from './components/material-detail/material-detail.component';
import { MaterialListComponent } from './components/material-list/material-list.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { PhysicalPrintDetailsPanelComponent } from './components/physical-print/physical-print-details-panel/physical-print-details-panel.component';
import { PhysicalPrintEditComponent } from './components/physical-print/physical-print-edit/physical-print-edit.component';
import { PhysicalPrintListComponent } from './components/physical-print/physical-print-list/physical-print-list.component';
import { PhysicalPrintMasterViewComponent } from './components/physical-print/physical-print-master-view/physical-print-master-view.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { HttpClientService } from './services/http/http-client.service';
import { PhysicalPartDetailPanelComponent } from './components/physical-part/physical-part-detail-panel/physical-part-detail-panel.component';
// import { PhysicalPartEditComponent } from './components/physical-part/physical-part-edit/physical-part-edit.component';
import { PhysicalPartListComponent } from './components/physical-part/physical-part-list/physical-part-list.component';
import { PhysicalPartMasterViewComponent } from './components/physical-part/physical-part-master-view/physical-part-master-view.component';

@NgModule({
  declarations: [
    AppComponent,
    StlViewerComponent,
    SidemenuComponent,
    HomeComponent,
    CustomerListComponent,
    CustomerDetailComponent,
    DigitalPartListComponent,
    DigitalPartEditComponent,
    DigitalPrintListComponent,
    DigitalPrintEditComponent,
    DigitalPrintMasterViewComponent,
    DigitalPrintDetailsPanelComponent,
    PhysicalPartListComponent,
//    PhysicalPartEditComponent,
    PhysicalPartDetailPanelComponent,
    PhysicalPartMasterViewComponent,
    PhysicalPrintDetailsPanelComponent,
    PhysicalPrintListComponent,
    PhysicalPrintEditComponent,
    OrderDetailComponent,
    OrderListComponent,
    MaterialListComponent,
    MaterialDetailComponent,
    CustomerDetailPanelComponent,
    CustomerMasterViewComponent,
    PhysicalPrintMasterViewComponent,
    DigitalPartDetailPanelComponent,
    DigitalPartMasterViewComponent,
  ],
  imports: [
    DropdownModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    BrowserModule,
    SidebarModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    HttpModule,

    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent,
      },
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
        component: DigitalPartMasterViewComponent,
      },
      {
        path: 'digital-parts/:id',
        component: DigitalPartEditComponent,
      },
      {
        path: 'digital-prints',
        component: DigitalPrintMasterViewComponent,
      },
      {
        path: 'digital-prints/:id',
        component: DigitalPrintEditComponent,
      },
      {
        path: 'physical-parts',
        component: PhysicalPartMasterViewComponent,
      },
//      {
//        path: 'physical-parts/:id',
//        component: PhysicalPartEditComponent,
//      },
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
    ]),
  ],

  providers: [HttpClientService],
  bootstrap: [AppComponent],
})
export class AppModule { }
