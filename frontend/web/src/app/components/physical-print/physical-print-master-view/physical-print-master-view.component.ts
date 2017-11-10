import { Component, OnInit } from '@angular/core';
import { PhysicalPrint } from '../../../model/physical-print';

@Component({
  selector: 'app-physical-print-master-view',
  templateUrl: './physical-print-master-view.component.html',
  styleUrls: ['./physical-print-master-view.component.scss'],
})
export class PhysicalPrintMasterViewComponent implements OnInit {

  selectedPhysicalPrint: PhysicalPrint = null;

  constructor() { }

  ngOnInit() {
  }

  physicalPrintSelected(event: PhysicalPrint) {
    this.selectedPhysicalPrint = event;
  }

}
