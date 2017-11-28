import { Component, EventEmitter, Input, OnChanges, Output, OnInit } from '@angular/core';
import {Customer} from '../../../model/customer';
import {CustomerService} from '../../../services/customer/customer.service';
import {DigitalPart} from '../../../model/digital-part';
import {Router} from '@angular/router';
import {Order} from "../../../model/order";

declare var $:any;

@Component({
  selector: 'app-customer-detail-panel',
  templateUrl: './customer-detail-panel.component.html',
  styleUrls: ['./customer-detail-panel.component.scss'],
  providers: [CustomerService],
})
export class CustomerDetailPanelComponent implements OnInit, OnChanges {
  private dPartsTable;
  private ordersTable;
  private loadingTable = false;
  private dataLoaded = false;
  @Input('customer') customer: Customer;
  @Output() closeReq: EventEmitter<null> = new EventEmitter<null>();
  private digitalParts: DigitalPart[];
  private orders: Order[];
  constructor(private customerService: CustomerService,
              private router: Router) {
  }

  ngOnInit() {
    this.dPartsTable = $('#dPartsTable');
    this.ordersTable = $('#ordersTable');
  }
  ngOnChanges() {
    this.customerService.getDigitalParts(this.customer.id).subscribe(
      (digitalParts) => {
        this.digitalParts = digitalParts;
        this.customerService.getOrders(this.customer.id).subscribe(
          (orders) => {
            this.orders = orders;
            this.dataLoaded = true;
            this.loadTables();
          }
        )
      }, (error) => {
        alert(error.verbose_message);
      },
    );
  }


  private loadTables(){
    if(this.dataLoaded && !this.loadingTable && this.dPartsTable && this.ordersTable ){
      this.loadingTable = true;
      this.populateDigitalParts();
      this.populateOrders();
      this.loadingTable = false;
    }
  }

  private populateDigitalParts() {
    const _self = this;
    /*manually generate columns*/
    const columns = [{
      title: 'Namn',
      field: 'name',
      sortable: true,
    }, {
      title: 'Part ID',
      field: 'id',
      visible: false,
      sortable: true,
    }, {
      field: 'operate',
      title: '<span class="glyphicon glyphicon-cog">',
      align: 'center',
      events: {
        'click .edit'(e, value, row, index) {
          _self.router.navigate(['digital-parts', row.id]);
        },
      },
      formatter: this.operateFormatter,
    }];

    const data = [];
    this.digitalParts.forEach((digitalPart) => {
      data.push({
        name: digitalPart.name,
        id: digitalPart.id,
      });
    });
    console.log(data, columns, this.dPartsTable);
    (this.dPartsTable as any).bootstrapTable('destroy');
    (this.dPartsTable as any).bootstrapTable(
      {
        data,
        columns,
        sortStable: true,
        sortName: 'name',
      },
    );
  }
  private populateOrders() {
    const _self = this;
    /*manually generate columns*/
    const columns = [{
      title: 'Date',
      field: 'date',
      sortable: true,
    }, {
      title: 'Order ID',
      field: 'id',
      visible: false,
      sortable: true,
    }, {
      field: 'operate',
      title: '<span class="glyphicon glyphicon-cog">',
      align: 'center',
      events: {
        'click .edit'(e, value, row, index) {
          _self.router.navigate(['orders', row.id]);
        },
      },
      formatter: this.operateFormatter,
    }];

    const data = [];
    this.orders.forEach((order) => {
      data.push({
        date: order.date,
        id: order.id,
      });
    });
    console.log(data, columns, this.ordersTable);
    (this.ordersTable as any).bootstrapTable('destroy');
    (this.ordersTable as any).bootstrapTable(
      {
        data,
        columns,
        sortStable: true,
        sortName: 'name',
      },
    );
  }
  private operateFormatter(value, row, index) {
    return [
      '<button class="edit btn btn-xs btn-primary" href="javascript:void(0)" title="Edit">',
      '<i class="glyphicon glyphicon-pencil"></i>',
      '</button>'
    ].join('');
  }

}
