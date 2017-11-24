import { Component, OnInit } from '@angular/core';
import {Customer} from '../../../model/customer';

@Component({
  selector: 'app-customer-master-view',
  templateUrl: './customer-master-view.component.html',
  styleUrls: ['./customer-master-view.component.scss'],
})
export class CustomerMasterViewComponent implements OnInit {

  selected: Customer = null;
  constructor() { }

  ngOnInit() {
  }

  public customerSelected(event) {
    this.selected = event;
  }

}
