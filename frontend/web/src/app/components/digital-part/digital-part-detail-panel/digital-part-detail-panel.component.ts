import { Component, Input, OnInit } from '@angular/core';
import {DigitalPart} from '../../../model/digital-part';
import {Customer} from '../../../model/customer';

@Component({
  selector: 'app-digital-part-detail-panel',
  templateUrl: './digital-part-detail-panel.component.html',
  styleUrls: ['./digital-part-detail-panel.component.scss'],
})
export class DigitalPartDetailPanelComponent implements OnInit {
  @Input('digitalPart') digitalPart: DigitalPart;
  @Input('customer') customer: Customer;

  constructor() { }

  ngOnInit() {
  }
}
