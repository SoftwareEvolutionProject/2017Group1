import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {PhysicalPart} from '../../../model/physical-part';
import {PhysicalPrint} from '../../../model/physical-print';
import {PhysicalPartService} from '../../../services/physical-part/physical-part.service';
import {DigitalPart} from "../../../model/digital-part";
import {DigitalPrint} from "../../../model/digital-print";
declare let $: any;

@Component({
  selector: 'app-physical-print-details-panel',
  templateUrl: './physical-print-details-panel.component.html',
  styleUrls: ['./physical-print-details-panel.component.scss'],
  providers: [PhysicalPartService],
})
export class PhysicalPrintDetailsPanelComponent implements OnInit, OnChanges {
  private table;
  private dataLoaded = false;
  private loadingTable = false;

  @Input('physicalPrint') physicalPrint: PhysicalPrint = null;
  @Input('physicalParts') physicalParts: PhysicalPart [] = null;
  @Input('digitalPrint') digitalPrint: DigitalPrint = null;
  @Input('digitalParts') digitalParts: DigitalPart [] = null;
  @Output() closeReq: EventEmitter<null> = new EventEmitter<null>();



  constructor(private physicalPartService: PhysicalPartService) {
    /* get parts */
    this.physicalPartService.getPhysicalParts().subscribe((pParts) => {
      this.physicalParts = pParts;
      this.dataLoaded = true;
      this.loadTable();
    });
  }

  ngOnInit() {
    this.table = $('#pPartsTable');
  }

  ngOnChanges() {
    if (this.dataLoaded && !this.loadingTable && this.table) { // make sure we truly have loaded the parts
      this.loadTable();
    }
  }


  private loadTable(){
    this.loadingTable = true;
    this.populate();
    this.loadingTable = false;
  }

  private populate() {
    const _self = this;
    /*manually generate columns*/
    const columns = [ {
      title: 'ID',
      field: 'id',
      sortable: true,
    }, {
      title: 'Order item ID',
      field: 'order',
      sortable: true,
    }, {
      title: 'Magics ID',
      field: 'mid',
      sortable: true,
    }];

    const data = [];

    this.physicalParts.filter((pPart) => {
      if (pPart.physicalPrintID === this.physicalPrint.id) {
        return pPart;
      }
    }).forEach((part) => {
      data.push({
        id: part.id,
        order: part.orderedPartID,
        mid: part.magicsPartPairingLabel,
      });
    });

    console.log(data, columns, this.table);

    (this.table as any).bootstrapTable('destroy');
    (this.table as any).bootstrapTable(
      {
        data,
        columns,
        sortStable: true,
        sortName: 'name',
      },
    );
  }
}
