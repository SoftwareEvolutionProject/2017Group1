import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Customer} from "../../model/customer";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {CustomerMockService} from "../../services/customer/customer-mock.service";
import {ErrorService} from "../../services/error.service";
import {Router} from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  providers: [CustomerMockService, ErrorService]
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  private table;
  private customers : Customer [];

  private modalRef: BsModalRef;
  @ViewChild('modalDelete') modalDelete;
  private toBeDeleted: number = null;

  constructor(private customerMockService: CustomerMockService,
              private errorService : ErrorService,
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
    this.customerMockService.getCustomers().subscribe(
      customers => {
        this.customers = customers;

        this.populate();
        this.prepareTriggers();
      }, error => {
        alert(error.verbose_message);
      }
    );
  }

  private populate() {
    let _self = this;
    /*manually generate columns*/
    let columns = [{
      title: "Namn",
      field: "name",
      sortable: true
    }, {
      title: "Kund ID",
      field: "id",
      visible: false,
      sortable: true
    }, {
      field: 'operate',
      title: '<span class="glyphicon glyphicon-cog">',
      align: 'center',
      events: {
        'click .edit': function (e, value, row, index) {
          _self.router.navigate([_self.router.url, row.id]);
        },
        'click .delete': function (e, value, row, index) {
          _self.delete(row.id)
        }
      },
      formatter: this.operateFormatter
    }];

    let data = [];
    this.customers.forEach((customer) => {
      data.push({
        name: customer.name,
        id: customer.id,
      });
    });

    (<any>this.table).bootstrapTable('destroy');
    (<any>this.table).bootstrapTable(
      {
        "data": data,
        "columns": columns,
        "sortStable": true,
        "sortName": "name"
      }
    );
  }

  private prepareTriggers() {
    /*let _self = this;
    (<any>this.table).on('click-row.bs.table', function (row, $element) {
      _self.router.navigate([_self.router.url, $element.id]);
    })*/
  }

  private amountFormatter(value, row, index) {
    return value > 0 ? '' : {
      css: {"background-color": "rgba(255, 0, 0, 0.4)"}
    };
  }

  private operateFormatter(value, row, index) {
    return [
      '<button class="edit btn btn-xs btn-primary" href="javascript:void(0)" title="Edit">',
      '<i class="glyphicon glyphicon-pencil"></i>',
      '</button>  ',
      '<button  class="delete btn btn-xs btn-danger" href="javascript:void(0)" title="Delete">',
      '<i class="glyphicon glyphicon-trash"></i>',
      '</button>'
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
      this.customerMockService.delete(this.toBeDeleted).subscribe(res => {
          this.toBeDeleted = null;
          this.modalRef.hide();
          this.loadAndPopulate();
        }, error => {
          this.errorService.showAlert(error.verobose_message_header, error.verbose_message);
        }
      );
    }
  }

  openModal(autoFocusIdWithHashtag: string) {
    this.modalRef = this.modalService.show(this.modalDelete);
    if (autoFocusIdWithHashtag != null && autoFocusIdWithHashtag != "") {
      let addInput: any = ($(autoFocusIdWithHashtag) as any);
      setTimeout(() => {
        addInput.focus();
      }, 200);
    }
  }

  private create() {
    this.router.navigate([this.router.url + "/create"]);
  }
}
