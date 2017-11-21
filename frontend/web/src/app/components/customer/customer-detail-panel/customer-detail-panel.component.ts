import { Component, EventEmitter, Input, OnChanges, Output, OnInit } from '@angular/core';
import {Customer} from '../../../model/customer';
import {CustomerService} from '../../../services/customer/customer.service';
import {DigitalPart} from '../../../model/digital-part';
import {Router} from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-customer-detail-panel',
  templateUrl: './customer-detail-panel.component.html',
  styleUrls: ['./customer-detail-panel.component.scss'],
  providers: [CustomerService],
})
export class CustomerDetailPanelComponent implements OnInit, OnChanges {
  private table;
  @Input('customer') customer: Customer;
  @Output() selected: EventEmitter<DigitalPart> = new EventEmitter<DigitalPart>();
  private digitalParts: DigitalPart[];
  constructor(private customerService: CustomerService,
              private router: Router) {
  }

  ngOnInit() {
    this.table = $('#dPartsTable');
    console.log(this.table);
  }
  ngOnChanges() {
    if (this.customer && this.table) {
      this.customerService.getDigitalParts(this.customer.id).subscribe(
        (digitalParts) => {
          this.digitalParts = digitalParts;
          this.populate();
        }, (error) => {
          alert(error.verbose_message);
        },
      );
    }
  }
  private prepareTriggers() {
    const _self = this;
    (this.table as any).on('click-row.bs.table', (row, $element) => {
      _self.selected.emit(_self.digitalParts.filter((digtialPart) => { if (digtialPart.id === $element.id) { return digtialPart; } })[0]);
    });
  }

  private populate() {
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
    console.log(data, columns, this.table);
    (this.table as any).bootstrapTable('destroy');
    (this.table as any).bootstrapTable(
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
      '</button>  '
    ].join('');
  }

}
