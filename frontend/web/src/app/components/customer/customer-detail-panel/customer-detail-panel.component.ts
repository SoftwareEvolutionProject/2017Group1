import {Component, Input, OnInit} from '@angular/core';
import {Customer} from '../../../model/customer';

@Component({
  selector: 'app-customer-detail-panel',
  templateUrl: './customer-detail-panel.component.html',
  styleUrls: ['./customer-detail-panel.component.scss'],
})
export class CustomerDetailPanelComponent implements OnInit {
  @Input('customer') customer: Customer;

  constructor() { }

  ngOnInit() {
  }
}
