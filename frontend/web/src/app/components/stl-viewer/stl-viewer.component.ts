import { Component, OnInit } from '@angular/core';
import { Viewer } from "../../stl-viewer/classes/Viewer";
import { StlLoader } from "../../stl-viewer/classes/StlLoader";
import { LoaderSelector } from "../../stl-viewer/classes/LoaderSelector";
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
      SceneUrl: 'https://rawgit.com/SoftwareEvolutionProject/2017Group1/feature/host-stl-file/top.stl'
    };

    //========================================================================
    var stlLoader = new StlLoader(null, null, null, null);
    stlLoader.setDecimalPrecision(3);

    //=========================================================================
    const viewer = new Viewer(canvas, parameters);
    viewer.setLoader(stlLoader);
    viewer.setParameter('Renderer', 'webgl');
    viewer.init();
  }

}
