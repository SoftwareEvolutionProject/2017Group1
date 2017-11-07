import {Component, Input, OnInit} from '@angular/core';
import {PhysicalPrint} from '../../../model/physical-print';


@Component({
  selector: 'app-physical-print-details-panel',
  templateUrl: './physical-print-details-panel.component.html',
  styleUrls: ['./physical-print-details-panel.component.scss']
})
export class PhysicalPrintDetailsPanelComponent implements OnInit {
  @Input('physicalPrint') physicalPrint: PhysicalPrint = null;

  constructor() { }

  ngOnInit() {
    console.log("physicalPrint", this.physicalPrint);
  }

}
