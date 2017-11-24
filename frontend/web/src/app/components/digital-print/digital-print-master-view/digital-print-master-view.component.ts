import { Component, OnInit } from '@angular/core';
import { DigitalPrint } from '../../../model/digital-print';

@Component({
  selector: 'app-digital-print-master-view',
  templateUrl: './digital-print-master-view.component.html',
  styleUrls: ['./digital-print-master-view.component.scss'],
})
export class DigitalPrintMasterViewComponent implements OnInit {

  selected: DigitalPrint = null;

  constructor() { }

  ngOnInit() {
  }

  digitalPrintSelected(event: DigitalPrint) {
    this.selected = event;
  }

}
