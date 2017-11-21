import {Component, Input, OnInit} from '@angular/core';
import {LoaderSelector} from '../../stl-viewer/LoaderSelector';
import {StlLoader} from '../../stl-viewer/StlLoader';
import {Viewer} from '../../stl-viewer/Viewer';
import {Router} from '@angular/router';

declare var JSC3D: any;

@Component({
  selector: 'app-stl-viewer',
  templateUrl: './stl-viewer.component.html',
  styleUrls: ['./stl-viewer.component.scss'],
})
export class StlViewerComponent implements OnInit {
  canvas = null;
  viewer: Viewer;
  @Input ('digitalPartID') digitalPartID: number;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.canvas = document.getElementById('stl');
    const parameters = {
      SceneUrl: 'https://rawgit.com/SoftwareEvolutionProject/2017Group1/feature/host-stl-file/top.stl',
    };

    // ========================================================================
    const stlLoader = new StlLoader(null, null, null, null);
    stlLoader.setDecimalPrecision(3);

    // =========================================================================
    this.viewer = new Viewer(this.canvas, parameters);
    this.viewer.setLoader(stlLoader);
    this.viewer.setParameter('Renderer', 'webgl');
    this.viewer.init();
  }

  resetView() {
    this.viewer.resetScene();
    this.viewer.update();
  }

  enlargeViewer() {
    this.router.navigate([this.router.url + '/'+this.digitalPartID+'/stl']);
  }

  toogleRotation() {
    //TODO Animation toogle goes in here
  }
}
