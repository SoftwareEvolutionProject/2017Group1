import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {DigitalPart} from '../../../model/digital-part';
import {Customer} from '../../../model/customer';
import {HttpClient} from "../../../services/http/http.client";

@Component({
  selector: 'app-digital-part-detail-panel',
  templateUrl: './digital-part-detail-panel.component.html',
  styleUrls: ['./digital-part-detail-panel.component.scss'],
})
export class DigitalPartDetailPanelComponent implements OnInit {
  @Input('digitalPart') digitalPart: DigitalPart;
  @Input('customer') customer: Customer;
  @Output() closeReq: EventEmitter<null> = new EventEmitter<null>();
  private baseUrl: string = HttpClient.baseUrl;
  constructor() { }

  ngOnInit() {
  }
}
