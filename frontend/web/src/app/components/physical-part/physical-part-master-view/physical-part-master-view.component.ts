import { Component, OnInit } from '@angular/core';
import {PhysicalPart} from '../../../model/physical-part';

@Component({
  selector: 'app-physical-part-master-view',
  templateUrl: './physical-part-master-view.component.html',
  styleUrls: ['./physical-part-master-view.component.scss'],
})
export class PhysicalPartMasterViewComponent implements OnInit {

  selectedPhysicalPart: PhysicalPart = null;
  constructor() { }

  ngOnInit() {
  }

  public physicalPartSelected(event) {
    this.selectedPhysicalPart = event;
  }

}
