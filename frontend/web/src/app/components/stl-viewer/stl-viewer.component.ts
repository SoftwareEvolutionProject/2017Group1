import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StlLoader} from '../../stl-viewer/StlLoader';
import {Viewer} from '../../stl-viewer/Viewer';
declare var JSC3D: any;

@Component({
  selector: 'app-stl-viewer',
  templateUrl: './stl-viewer.component.html',
  styleUrls: ['./stl-viewer.component.scss'],
})
export class StlViewerComponent implements OnInit {
  viewer: Viewer;
  private rotate = false;
  private timer = null;

  @Input ('digitalPartID') digitalPartID: number;

  constructor(private router: Router) {
  }

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

  resetView() {
    this.viewer.resetScene();
    this.viewer.update();
  }

  toogleRotation() {
    this.rotate = !this.rotate;

    if (this.rotate) {
      this.timer = setInterval(() => {
        this.viewer.rotate(0.25, 0.5, 0.1);
        this.viewer.update();
      }, 10);
    } else {
      clearInterval(this.timer);
    }
  }

  enlargeViewer() {
    this.router.navigate([this.router.url + '/' + this.digitalPartID + '/stl']);
  }
}
