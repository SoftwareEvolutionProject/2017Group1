import { Component, OnInit } from '@angular/core';
import { LoaderSelector } from '../../stl-viewer/LoaderSelector';
import { StlLoader } from '../../stl-viewer/StlLoader';
import { Viewer } from '../../stl-viewer/Viewer';

@Component({
  selector: 'app-stl-viewer',
  templateUrl: './stl-viewer.component.html',
  styleUrls: ['./stl-viewer.component.scss'],
})
export class StlViewerComponent implements OnInit {
  viewer: Viewer;
  private rotate = false;
  private timer = null;

  constructor() { }

  ngOnInit() {
    const canvas = document.getElementById('stl');
    const parameters = {
      SceneUrl: 'https://rawgit.com/SoftwareEvolutionProject/2017Group1/feature/host-stl-file/top.stl',
    };

    // ========================================================================
    const stlLoader = new StlLoader(null, null, null, null);
    stlLoader.setDecimalPrecision(3);

    // =========================================================================
    this.viewer = new Viewer(canvas, parameters);
    this.viewer.setLoader(stlLoader);
    this.viewer.setParameter('Renderer', 'webgl');
    this.viewer.init();
  }

  resetView(){
    this.viewer.resetScene();
    this.viewer.update();
  }

  toogleRotation() {
    this.rotate = !this.rotate;

    if (this.rotate) {
      this.timer = setInterval(() => {
        console.log('rotating');
        this.viewer.rotate(0.25, 0.5, 0.1);
        this.viewer.update();
      }, 10);
    } else {
      clearInterval(this.timer);
    }
  }
}
