import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PhysicalPrint} from '../../../model/physical-print';
//import {PhysicalPrintService} from '../../../services/physical-print/physical-print.service';
import {PhysicalPrintMockService as PhysicalPrintService} from '../../../services/physical-print/physical-print-mock.service';
import {ErrorService} from '../../../services/error.service';
declare var $: any;

@Component({
  selector: 'app-physical-print-list',
  templateUrl: './physical-print-list.component.html',
  styleUrls: ['./physical-print-list.component.scss'],
  providers: [PhysicalPrintService, ErrorService]
})
export class PhysicalPrintListComponent implements OnInit {
  private modalRef: BsModalRef;
  @ViewChild('modalDelete') modalDelete;
  private toBeDeleted: number = null;

  private table;
  @Input('physicalPrint') physicalPrints: PhysicalPrint [];
  @Output() selected: EventEmitter<PhysicalPrint> = new EventEmitter<PhysicalPrint>();


  constructor(private physicalPrintService: PhysicalPrintService,
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
    this.physicalPrintService.getAll().subscribe(
      (physicalPrints) => {
        this.physicalPrints = physicalPrints;

        this.populate();
        this.prepareTriggers();
      }, (error) => {
        alert(error.verbose_message);
      },
    );
  }

  private populate() {
    const _self = this;
    /*manually generate columns*/
    const columns = [{
      title: 'Namn',
      field: 'name',
      sortable: true,
    }, {
      title: 'Kund ID',
      field: 'id',
      visible: false,
      sortable: true,
    }, {
      field: 'operate',
      title: '<span class="glyphicon glyphicon-cog">',
      align: 'center',
      events: {
        'click .edit': function(e, value, row, index) {
          _self.router.navigate([_self.router.url, row.id]);
        },
        'click .delete': function(e, value, row, index) {
          _self.delete(row.id);
        },
      },
      formatter: this.operateFormatter,
    }];

    const data = [];
    this.physicalPrints.forEach((physicalPrint) => {
      data.push({
        name: physicalPrint.name,
        id: physicalPrint.id,
      });
    });

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

  private prepareTriggers() {
    const _self = this;
    (this.table as any).on('click-row.bs.table', function(row, $element) {
      _self.selected.emit(_self.physicalPrints.filter((physicalPrint) => {if (physicalPrint.id ===  $element.id)return physicalPrint; })[0]);
    });
  }

  private amountFormatter(value, row, index) {
    return value > 0 ? '' : {
      css: {'background-color': 'rgba(255, 0, 0, 0.4)'},
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
      this.physicalPrintService.delete(this.toBeDeleted).subscribe((res) => {
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
    if (autoFocusIdWithHashtag != null && autoFocusIdWithHashtag != '') {
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
