import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import {Material} from '../../../model/material';
import {Customer} from '../../../model/customer';
import {CustomerService} from '../../../services/customer/customer.service';
import {ErrorService} from '../../../services/error.service';
import {MaterialService} from '../../../services/material/material.service';

declare var $: any;

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss'],
  providers: [MaterialService, CustomerService, ErrorService],
})
export class MaterialListComponent implements OnInit, AfterViewInit {
  @Output() selected: EventEmitter<Material> = new EventEmitter<Material>();
  private table;
  private materials: Material[];
  private customers: Customer[];

  private modalRef: BsModalRef;
  @ViewChild('modalDelete') modalDelete;
  private toBeDeleted: number = null;
  selectedMaterial: Material = null;

  constructor(private customerService: CustomerService,
              private materialService: MaterialService,
              private errorService: ErrorService,
              private router: Router,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.table = $('#table');
  }

  ngAfterViewInit(): void {
    this.loadAndPopulate();
  }

  loadAndPopulate() {
    /* get users */
    this.materialService.getMaterials().subscribe(
      (materials) => {
        this.customerService.getCustomers().subscribe(
          (customers) => {
            this.customers = customers;
            this.materials = materials;
            this.populate();
            this.prepareTriggers();
          },
        );
      }, (error) => {
        alert(error.verbose_message);
      },
    );
  }

  private populate() {
    const _self = this;
    /*manually generate columns*/
    const columns = [{
      title: 'ID',
      field: 'id',
      sortable: true,
    }, {
      title: 'Customer',
      field: 'customer',
      sortable: true,
    }, {
      title: 'Date',
      field: 'date',
      sortable: true,
    }, {
      field: 'operate',
      title: '<span class="glyphicon glyphicon-cog">',
      align: 'center',
      events: {
        'click .edit'(e, value, row, index) {
          _self.router.navigate([_self.router.url, row.id]);
        },
        'click .delete'(e, value, row, index) {
          _self.delete(row.id);
        },
      },
      formatter: this.operateFormatter,
    }];

    const data = [];
    this.materials.forEach((material) => {
      this.customers.forEach((customer) => {
        if (material.customerID === customer.id) {
          const date = new Date(material.date);
          const mm = date.getMonth() + 1;
          const dd = date.getDate();
          const dateString = [date.getFullYear(), '-',
            (mm>9 ? '' : '0') + mm, '-',
            (dd>9 ? '' : '0') + dd
          ].join('');
          data.push({
            id: material.id,
            customer: customer.name,
            date: dateString,
          });
        }
      });
    });

    (this.table as any).bootstrapTable('destroy');
    (this.table as any).bootstrapTable(
      {
        data,
        columns,
        sortStable: true,
        sortName: 'id',
      },
    );
  }

  private prepareTriggers() {
    const _self = this;
    (this.table as any).on('click-row.bs.table', (row, $element) => {
      _self.selected.emit(_self.materials.filter((material) => { if (material.id === $element.id) { return material; } })[0]);
    });
  }

  private amountFormatter(value, row, index) {
    return value > 0 ? '' : {
      css: { 'background-color': 'rgba(255, 0, 0, 0.4)' },
    };
  }

  private operateFormatter(value, row, index) {
    return [
      '<button class="edit btn btn-xs btn-primary" href="javascript:void(0)" title="Edit">',
      '<i class="glyphicon glyphicon-pencil"></i>',
      '</button>  ',
      '<button  class="delete btn btn-xs btn-danger" href="javascript:void(0)" title="Delete">',
      '<i class="glyphicon glyphicon-trash"></i>',
      '</button>',
    ].join('');
  }

  private delete(id) {
    this.toBeDeleted = id;
    this.openModal('#deleteFormDismissBtn');
  }

  private dismissDelete() {
    this.toBeDeleted = null;
    this.modalRef.hide();
  }

  private confirmDelete() {
    if (this.toBeDeleted) {
      this.materialService.deleteMaterial(this.toBeDeleted).subscribe((res) => {
        this.toBeDeleted = null;
        this.modalRef.hide();
        this.loadAndPopulate();
      }, (error) => {
        this.errorService.showAlert(error.verobose_message_header, error.verbose_message);
      },
      );
    }
  }

  openModal(autoFocusIdWithHashtag: string) {
    this.modalRef = this.modalService.show(this.modalDelete);
    if (autoFocusIdWithHashtag != null && autoFocusIdWithHashtag !== '') {
      const addInput: any = ($(autoFocusIdWithHashtag) as any);
      setTimeout(() => {
        addInput.focus();
      }, 200);
    }
  }

  private create() {
    this.router.navigate([this.router.url + '/create']);
  }
}
