import { Component, Input, OnInit } from '@angular/core';
import {PhysicalPart} from '../../../model/physical-part';

@Component({
  selector: 'app-physical-part-detail-panel',
  templateUrl: './physical-part-detail-panel.component.html',
  styleUrls: ['./physical-part-detail-panel.component.scss'],
})
export class PhysicalPartDetailPanelComponent implements OnInit {
  @Input('physicalPart') physicalPart: PhysicalPart;

  constructor() { }

  ngOnInit() {
  }
}
