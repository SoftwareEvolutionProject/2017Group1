import { Component, OnInit } from '@angular/core';
declare var JSC3D: any;

@Component({
  selector: 'app-stl-viewer',
  templateUrl: './stl-viewer.component.html',
  styleUrls: ['./stl-viewer.component.css']
})
export class StlViewerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const canvas = document.getElementById('stl');
    const viewer = new JSC3D.Viewer(canvas);
    viewer.init();
  }

}
