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
  private orderedParts: OrderedPart[];

  constructor(private customerService: CustomerService,
              private orderService: OrderService,
              private router: Router) {
  }

  ngOnInit() {
    this.oPartsTable = $('#oPartsTable');
    this.customerService.getCustomer(this.order.customerID).subscribe(
      (customer) => {
        this.customer = customer;
      },
    );
  }
  ngOnChanges() {
    /*this.orderService.getOrderedParts(this.order.id).subscribe(
      (orderedParts) => {
        this.orderedParts = orderedParts;
            this.dataLoaded = true;
            this.loadTables();
      }, (error) => {
        alert(error.verbose_message);
      },
    );*/
  }


  private loadTables() {
    if (this.dataLoaded && !this.loadingTable && this.oPartsTable) {
      this.loadingTable = true;
      this.populateOrderedParts();
      this.loadingTable = false;
    }
  }

  private populateOrderedParts() {
    const _self = this;
    /*manually generate columns*/
    const columns = [{
      title: 'Digital Part',
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
    }, {
      field: 'operate',
      title: '<span class="glyphicon glyphicon-cog">',
      align: 'center',
      events: {
        'click .edit'(e, value, row, index) {
          _self.router.navigate(['ordered-parts', row.id]);
        },
      },
      formatter: this.operateFormatter,
    }];

    const data = [];
    this.orderedParts.forEach((orderedPart) => {
      data.push({
        digitalPardID: orderedPart.digitalPartID,
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
  private operateFormatter(value, row, index) {
    return [
      '<button class="edit btn btn-xs btn-primary" href="javascript:void(0)" title="Edit">',
      '<i class="glyphicon glyphicon-pencil"></i>',
      '</button>'
    ].join('');
  }

}
