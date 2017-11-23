import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {PhysicalPart} from '../../../model/physical-part';
import {PhysicalPrint} from '../../../model/physical-print';
import {PhysicalPartService} from '../../../services/physical-part/physical-part.service';
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
  @Input('physicalPrint') physicalPrint: PhysicalPrint = null;
  @Input('physicalParts') physicalParts: PhysicalPart [] = null;

  constructor(private physicalPartService: PhysicalPartService) {
    /* get parts */
    this.physicalPartService.getPhysicalParts().subscribe((pParts) => {
      this.physicalParts = pParts;
      this.dataLoaded = true;
    });
  }

  ngOnInit() {
    this.table = $('#pPartsTable');
  }

  ngOnChanges() {
    if (this.dataLoaded && this.table) { // make sure we truly have loaded the parts
      this.populate();
    }
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
        mid: part.magicsPartPairingID,
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
