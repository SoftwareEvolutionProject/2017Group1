import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {Material} from "../../../model/material";
import {MaterialService} from "../../../services/material/material.service";
import {Router} from "@angular/router";
import {CustomerService} from "../../../services/customer/customer.service";

declare var $: any;

@Component({
  selector: 'app-material-detail-panel',
  templateUrl: './material-detail-panel.component.html',
  styleUrls: ['./material-detail-panel.component.scss'],
  providers: [MaterialService, CustomerService],
})
export class MaterialDetailPanelComponent implements OnInit, OnChanges {
  private materialTable;
  private loadingTable = false;
  private dataLoaded = false;
  @Input('material') material: Material;
  @Output() closeReq: EventEmitter<null> = new EventEmitter<null>();
  private dateString: string;
  private materialPropertiesFieldNames;

  constructor(private customerService: CustomerService,
              private materialService: MaterialService,
              private router: Router) {
  }

  ngOnInit() {
    this.materialTable = $('#materialTable');
    if (this.material) {
      this.getMaterialInfo();
    }
  }

  private getMaterialInfo() {
    this.materialService.getMaterial(this.material.id).subscribe(
      (material) => {
        this.material = material;
        this.loadTables();
      },
    );
  }

  ngOnChanges() {
    this.loadTables();
    if (this.material) {
      this.getMaterialInfo();
    }
  }

  private loadTables() {
    if (!this.loadingTable && this.materialTable) {
      this.loadingTable = true;
      this.populateMaterialGrades();
      this.populateMaterialProperties();
      this.loadingTable = false;
    }
  }

  private populateMaterialProperties() {
    this.materialPropertiesFieldNames = [];
    this.materialPropertiesFieldNames = Object.getOwnPropertyNames(this.material.materialProperties); /*.forEach((id) => {
      this.materialPropertiesFieldNames.push(this.formBuilder.group({
        magicsId: [id,
          Validators.compose([Validators.required])],
        digitalPart: [this.digitalPrint.magicsPartPairing[id] ? this.digitalPrint.magicsPartPairing[id] : '',
          Validators.compose([Validators.required])],
      }));
    });*/
    console.log("Material properties field names: ", this.materialPropertiesFieldNames);

  }

  private populateMaterialGrades() {
    const _self = this;
    /*manually generate columns*/
    const columns = [{
      title: 'ID',
      field: 'id',
      sortable: true,
    }, {
      title: 'Material ID',
      field: 'materialID',
      sortable: true,
    }, {
      title: 'Reused times',
      field: 'reusedTimes',
      sortable: true,
    }, {
      title: 'amount',
      field: 'amount',
      sortable: true,
    }];

    const data = [];
    this.material.materialGrades.forEach((materialGrade) => {
      data.push({
        id: materialGrade.id,
        materialID: materialGrade.materialID,
        reusedTimes: materialGrade.reusedTimes,
        amount: materialGrade.amount,
      });
    });
    console.log(data, columns, this.materialTable);
    (this.materialTable as any).bootstrapTable('destroy');
    (this.materialTable as any).bootstrapTable(
      {
        data,
        columns,
        sortStable: true,
        sortName: 'id',
      },
    );
  }
}
