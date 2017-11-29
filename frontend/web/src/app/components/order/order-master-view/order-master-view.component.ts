import { Component, OnInit } from '@angular/core';
import {Order} from '../../../model/order';

@Component({
  selector: 'app-order-master-view',
  templateUrl: './order-master-view.component.html',
  styleUrls: ['./order-master-view.component.scss'],
})
export class OrderMasterViewComponent implements OnInit {

  selected: Order = null;
  constructor() { }

  ngOnInit() {
  }

  public orderSelected(event) {
    this.selected = event;
  }

}
