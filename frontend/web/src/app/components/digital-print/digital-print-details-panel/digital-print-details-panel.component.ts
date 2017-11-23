import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {DigitalPart} from '../../../model/digital-part';
import {DigitalPrint} from '../../../model/digital-print';
import {DigitalPartService} from '../../../services/digital-part/digital-part.service';

declare let $: any;

@Component({
  selector: 'app-digital-print-details-panel',
  templateUrl: './digital-print-details-panel.component.html',
  styleUrls: ['./digital-print-details-panel.component.scss'],
  providers: [DigitalPartService],
})
export class DigitalPrintDetailsPanelComponent implements OnInit, OnChanges {
  private table;
  @Input('digitalPrint') digitalPrint: DigitalPrint = null;
  private digitalParts: DigitalPart[];

  constructor(private digitalPartService: DigitalPartService) {

    /* get parts */
    this.digitalPartService.getDigitalParts().subscribe((dParts) => {
      this.digitalParts = dParts;
    });
  }

  ngOnInit() {
    this.table = $('#dPartsTable');
  }

  ngOnChanges(){
    if (this.digitalParts && this.table) { // make sure we truly have loaded the parts
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
      title: 'Name',
      field: 'name',
      sortable: true,
    }, {
      title: 'Magics ID',
      field: 'mid',
      sortable: true,
    },  {
      title: 'STL File',
      field: 'path',
      sortable: true,
    }];

    const data = [];

    Object.getOwnPropertyNames(this.digitalPrint.magicsPartPairing).forEach((key) => {
      const dPart = this.digitalParts.filter((dPart) => {
        if (dPart.id === this.digitalPrint.magicsPartPairing[key]){
          return dPart;
        }
      })[0];

      data.push({
        path: dPart.path,
        name: dPart.name,
        id: dPart.id,
        mid: key,
      });
    });

    console.log(data, columns, this.table);

    (this.table as any).bootstrapTable('destroy');
    (this.table as any).bootstrapTable(
      {
        data,
        columns,
        sortStable: true,
        sortName: 'mid',
      },
    );
  }
}
