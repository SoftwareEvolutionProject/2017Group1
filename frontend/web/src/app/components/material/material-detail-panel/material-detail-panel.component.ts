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
  private oPartsTable;
  private loadingTable = false;
  private dataLoaded = false;
  @Input('material') material: Material;
  @Output() closeReq: EventEmitter<null> = new EventEmitter<null>();
  private dateString: string;
  // private materialedParts: MaterialedPart[];

  constructor(private customerService: CustomerService,
              private materialService: MaterialService,
              private router: Router) {
  }

  ngOnInit() {
    this.oPartsTable = $('#oPartsTable');
    if (this.material) {
      // this.getCustomerInfo();
    }
  }

  private getCustomerInfo() {
    /*this.customerService.getCustomer(this.material.customerID).subscribe(
      (customer) => {
        this.customer = customer;
        const date = new Date(this.material.date);
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        this.dateString = [date.getFullYear(), '-',
          (mm > 9 ? '' : '0') + mm, '-',
          (dd > 9 ? '' : '0') + dd
        ].join('');
        this.loadTables();
      },
    );*/
  }

  ngOnChanges() {
    this.loadTables();
    if (this.material) {
      this.getCustomerInfo();
    }
  }

  private loadTables() {
    if (!this.loadingTable && this.oPartsTable) {
      this.loadingTable = true;
      this.populateMaterialedParts();
      this.loadingTable = false;
    }
  }

  private populateMaterialedParts() {
    const _self = this;
    /*manually generate columns*/
    const columns = [{
      title: 'ID',
      field: 'id',
      visible: false,
      sortable: true,
    }, {
      title: 'Name',
      field: 'name',
      sortable: true,
    }, {
      title: 'Supplier name',
      field: 'supplierName',
      sortable: true,
    }, {
      title: 'Initial ammount',
      field: 'supplierName',
      sortable: true,
    }, {
      title: 'Material grades',
      field: 'materialGrades',
      sortable: true,
    }, {
      title: 'Material properties',
      field: 'materialProperties',
      sortable: true,
    }];
/*
    const data = [];
    console.log(this.material.materialedParts);
    this.material.materialedParts.forEach((materialedPart) => {
      data.push({
        digitalPartID: materialedPart.digitalPartID,
        amount: materialedPart.amount,
        id: materialedPart.id,
      });
    });
    console.log(data, columns, this.oPartsTable);
    (this.oPartsTable as any).bootstrapTable('destroy');
    (this.oPartsTable as any).bootstrapTable(
      {
        data,
        columns,
        sortStable: true,
        sortName: 'name',
      },
    );*/
  }
}
