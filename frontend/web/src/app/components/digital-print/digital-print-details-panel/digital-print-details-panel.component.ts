import {Component, Input, OnInit} from '@angular/core';
import {DigitalPrint} from '../../../model/digital-print';


@Component({
  selector: 'app-digital-print-details-panel',
  templateUrl: './digital-print-details-panel.component.html',
  styleUrls: ['./digital-print-details-panel.component.scss'],
})
export class DigitalPrintDetailsPanelComponent implements OnInit {
  @Input('digitalPrint') digitalPrint: DigitalPrint = null;

  constructor() { }

  ngOnInit() {
  }

}
