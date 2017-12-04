import { Component, OnInit } from '@angular/core';
import {DigitalPart} from '../../../model/digital-part';
import {DigitalPrint} from '../../../model/digital-print';
import {PhysicalPart} from '../../../model/physical-part';
import { PhysicalPrint } from '../../../model/physical-print';
import {DigitalPartService} from '../../../services/digital-part/digital-part.service';
import {DigitalPrintService} from '../../../services/digital-print/digital-print.service';
import {PhysicalPartService} from '../../../services/physical-part/physical-part.service';
import {PhysicalPrintService} from '../../../services/physical-print/physical-print.service';

@Component({
  selector: 'app-physical-print-master-view',
  templateUrl: './physical-print-master-view.component.html',
  styleUrls: ['./physical-print-master-view.component.scss'],
  providers: [DigitalPrintService, DigitalPartService, PhysicalPrintService, PhysicalPartService]
})
export class PhysicalPrintMasterViewComponent implements OnInit {
  physicalParts: PhysicalPart[];
  digitalParts: DigitalPart[];
  digitalPrints: DigitalPrint[];
  physicalPrints: PhysicalPrint[];

  selected: PhysicalPrint = null;
  private loaded = false;
  private digitalPrint: DigitalPrint;

  constructor(
    private digitalPrintService: DigitalPrintService,
    private digitalPartService: DigitalPartService,
    private physicalPrintService: PhysicalPrintService,
    private physicalPartService: PhysicalPartService,
  ) {
    this.digitalPrintService.getDigitalPrints().subscribe((dPrints) => {
      this.digitalPrints = dPrints;
      this.digitalPartService.getDigitalParts().subscribe((dParts) => {
        this.digitalParts = dParts;
        this.physicalPrintService.getAllPhysicalPrint().subscribe((pPrints) => {
          this.physicalPrints = pPrints;
          this.physicalPartService.getPhysicalParts().subscribe((pParts) => {
            this.physicalParts = pParts;
            this.loaded = true;
          });
        });
      });
    });
  }

  ngOnInit() {
  }

  physicalPrintSelected(event: PhysicalPrint) {
    this.selected = event;
    this.digitalPrint = this.digitalPrints.filter((dPrint) => {
      if(dPrint.id === event.digitalPrintID){
        return dPrint;
      }
    })[0];
  }

}
