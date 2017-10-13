import { Component, OnInit } from '@angular/core';
import { Viewer } from "./classes/Viewer"
declare var JSC3D: any;

@Component({
  selector: 'app-stl-viewer',
  templateUrl: './stl-viewer.component.html',
  styleUrls: ['./stl-viewer.component.scss']
})
export class StlViewerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const canvas = document.getElementById('stl');
    const parameters = {
      SceneUrl: 'https://cors-anywhere.herokuapp.com/jberlin.se/stl/top.stl'
    };
    /*const viewer = new JSC3D.Viewer(canvas, parameters);
    viewer.setParameter('Renderer', 'webgl');
    viewer.enableDefaultInputHandler(true);
    viewer.init();*/

    const viewer = new Viewer(canvas, parameters);
    viewer.init();
    console.log(viewer);
  }

}
