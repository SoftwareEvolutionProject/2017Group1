import { Component, OnInit } from '@angular/core';
import {Material} from '../../../model/material';

@Component({
  selector: 'app-material-master-view',
  templateUrl: './material-master-view.component.html',
  styleUrls: ['./material-master-view.component.scss'],
})
export class MaterialMasterViewComponent implements OnInit {

  selected: Material = null;
  constructor() { }

  ngOnInit() {
  }

  public materialSelected(event) {
    this.selected = event;
  }

}
