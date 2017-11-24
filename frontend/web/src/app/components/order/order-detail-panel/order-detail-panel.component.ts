import { Component, EventEmitter, Input, OnChanges, Output, OnInit } from '@angular/core';
import {Order} from '../../../model/order';
import {Customer} from '../../../model/customer';
import {OrderService} from '../../../services/order/order.service';
import {OrderedPart} from '../../../model/ordered-part';
import {Router} from '@angular/router';
import {CustomerService} from '../../../services/customer/customer.service';

declare var $:any;

@Component({
  selector: 'app-order-detail-panel',
  templateUrl: './order-detail-panel.component.html',
  styleUrls: ['./order-detail-panel.component.scss'],
  providers: [OrderService, CustomerService],
})
export class OrderDetailPanelComponent implements OnInit, OnChanges {
  private oPartsTable;
  private loadingTable = false;
  private dataLoaded = false;
  @Input('order') order: Order;
  @Output() closeReq: EventEmitter<null> = new EventEmitter<null>();
  private customer: Customer;
  private dateString: string;
  private orderedParts: OrderedPart[];

  constructor(private customerService: CustomerService,
              private orderService: OrderService,
              private router: Router) {
  }

  ngOnInit() {
    this.oPartsTable = $('#oPartsTable');
    if (this.order) {
      this.customerService.getCustomer(this.order.customerID).subscribe(
        (customer) => {
          this.customer = customer;
          const date = new Date(this.order.date);
          const mm = date.getMonth() + 1;
          const dd = date.getDate();
          this.dateString = [date.getFullYear(), '-',
            (mm>9 ? '' : '0') + mm, '-',
            (dd>9 ? '' : '0') + dd
          ].join('');
          this.loadTables();
        },
      );
    }
  }
  ngOnChanges() {
      this.loadTables();
  }


  private loadTables() {
    if (!this.loadingTable && this.oPartsTable) {
      this.loadingTable = true;
      this.populateOrderedParts();
      this.loadingTable = false;
    }
  }

  private populateOrderedParts() {
    const _self = this;
    /*manually generate columns*/
    const columns = [{
      title: 'Digital Part ID',
      field: 'digitalPartID',
      sortable: true,
    }, {
        title: 'ID',
        field: 'id',
        visible: false,
        sortable: true,
    },{
      title: 'Amount',
      field: 'amount',
      sortable: true,
    }];

    const data = [];
    console.log(this.order.orderedParts);
    this.order.orderedParts.forEach((orderedPart) => {
      data.push({
        digitalPartID: orderedPart.digitalPartID,
        amount: orderedPart.amount,
        id: orderedPart.id,
      });
    });
    console.log(data, columns, this.oPartsTable);
    (this.oPartsTable as any).bootstrapTable('destroy');
    (this.oPartsTable as any).bootstrapTable(
      {
        data,
        columns,
        sortStable: true,
        sortName: 'name',
      },
    );
  }
}
