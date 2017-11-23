import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
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
  private loadingTable = false;
  private dataLoaded = false;
  @Input('digitalPrint') digitalPrint: DigitalPrint = null;
  @Input('digitalParts') digitalParts: DigitalPart[];
  @Output() closeReq: EventEmitter<null> = new EventEmitter<null>();
  selected: DigitalPart;

  constructor(private digitalPartService: DigitalPartService) {

    /* get parts */
    this.digitalPartService.getDigitalParts().subscribe((dParts) => {
      this.digitalParts = dParts;
      this.dataLoaded = true;
      this.loadTable();
    });
  }

  ngOnInit() {
    this.table = $('#dPartsTable');
  }

  ngOnChanges() {
    this.selected = null;
    this.loadTable();
  }

  private loadTable(){
    if(this.dataLoaded && !this.loadingTable && this.table ){
      this.loadingTable = true;
      this.populate();
      this.prepareTriggers();
      this.loadingTable = false;
    }
  }

  private prepareTriggers() {
    const _self = this;
    (this.table as any).on('click-row.bs.table', (row, $element) => {
      _self.selected = _self.digitalParts.filter((digitalPart) => {
        if (digitalPart.id ===  $element.id) {
          return digitalPart;
        }
      })[0];
    });
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
      field: 'stlpath',
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
        stlpath: dPart.stlPath,
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
