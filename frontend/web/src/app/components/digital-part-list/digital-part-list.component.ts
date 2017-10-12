import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DigitalPart} from "../../model/digital-part";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {DigitalPartMockService} from "../../services/digital-part/digital-part-mock.service";
import {ErrorService} from "../../services/error.service";
import {Router} from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-digital-part-list',
  templateUrl: './digital-part-list.component.html',
  styleUrls: ['./digital-part-list.component.scss'],
  providers: [DigitalPartMockService, ErrorService]
})
export class DigitalPartListComponent implements OnInit, AfterViewInit {
  private table;
  private digitalParts : DigitalPart [];

  private modalRef: BsModalRef;
  @ViewChild('modalDelete') modalDelete;
  private toBeDeleted: number = null;

  constructor(private digitalPartMockService: DigitalPartMockService,
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
    this.digitalPartMockService.getCustomers().subscribe(
      customers => {
        this.digitalParts = customers;

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
    this.digitalParts.forEach((digitalPart) => {
      data.push({
        name: digitalPart.name,
        id: digitalPart.id,
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
      this.digitalPartMockService.delete(this.toBeDeleted).subscribe(res => {
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
