import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
export class StlViewerComponent implements OnInit, OnChanges {
  baseUrl = 'http://localhost:4567';
  canvas = null;
  viewer: Viewer;
  @Input ('digitalPartID') digitalPartID: number;
  @Input ('stlUrl') stlUrl: string;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.canvas = document.getElementById('stl');
    const parameters = {
      SceneUrl: this.baseUrl + this.stlUrl,
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
  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewer) {
      this.viewer.replaceSceneFromUrl(this.baseUrl + this.stlUrl);
      this.viewer.update();
    }
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
