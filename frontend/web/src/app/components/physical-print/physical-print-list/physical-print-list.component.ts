import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PhysicalPrint} from '../../../model/physical-print';
import {ErrorService} from '../../../services/error.service';
import {PhysicalPrintService} from '../../../services/physical-print/physical-print.service';
declare var $: any;

@Component({
  selector: 'app-physical-print-list',
  templateUrl: './physical-print-list.component.html',
  styleUrls: ['./physical-print-list.component.scss'],
  providers: [PhysicalPrintService, ErrorService],
})
export class PhysicalPrintListComponent implements OnInit, OnChanges {

  private modalRef: BsModalRef;
  @ViewChild('modalDelete') modalDelete;
  private toBeDeleted: number = null;

  private table;
  @Input('physicalPrints') physicalPrints: PhysicalPrint [];
  @Output() selected: EventEmitter<PhysicalPrint> = new EventEmitter<PhysicalPrint>();
  @Output() refresh: EventEmitter<null> = new EventEmitter<null>();

  constructor(private errorService: ErrorService,
              private router: Router,
              private modalService: BsModalService,
              private physicalPrintService: PhysicalPrintService) {
  }

  ngOnInit() {
    this.table = $('#table');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.physicalPrints) {
      this.populate();
      this.prepareTriggers();
    }
  }

  private populate() {
    this.table = $('#table');
    const _self = this;
    /*manually generate columns*/
    const columns = [ {
      title: 'ID',
      field: 'id',
      sortable: true,
    }, {
      title: 'Digital Print',
      field: 'digitalPrintID',
      sortable: true,
    }, {
      title: 'SLM File',
      field: 'path',
      sortable: true,
    }, {
      field: 'operate',
      title: '<span class="glyphicon glyphicon-cog">',
      align: 'center',
      events: {
        'click .edit': function(e, value, row, index) {
          _self.router.navigate([_self.router.url, row.id]);
        },
        'click .download'(e, value, row, index) {
          _self.download(row.id);
        },
        'click .delete': function(e, value, row, index) {
          _self.delete(row.id);
        },
      },
      formatter: this.operateFormatter,
    }];

    const data = [];
    this.physicalPrints.forEach((physicalPrint) => {
      console.log(physicalPrint)
      data.push({
        path: physicalPrint.path,
        id: physicalPrint.id,
        digitalPrintID : physicalPrint.digitalPrintID,
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

  loadAndPopulate() {
    /* get users */
    this.physicalPrintService.getAllPhysicalPrint().subscribe(
      (physicalPrints) => {
        this.physicalPrints = physicalPrints;

        this.populate();
        this.prepareTriggers();
      }, (error) => {
        alert(error.verbose_message);
      },
    );
  }

  private prepareTriggers() {
    const _self = this;
    (this.table as any).on('click-row.bs.table', (row, $element) => {
      _self.selected.emit(_self.physicalPrints.filter((physicalPrint) => {
        if (physicalPrint.id ===  $element.id) {
          return physicalPrint;
        }
      })[0]);
    });
  }

  private amountFormatter(value, row, index) {
    return value > 0 ? '' : {
      css: {'background-color': 'rgba(255, 0, 0, 0.4)'},
    };
  }

  private operateFormatter(value, row, index) {
    return [
      '<button class="download btn btn-xs btn-primary" href="_self" title="Download">',
      '<i class="glyphicon glyphicon-download-alt"></i>',
      '</button>  ',
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
  private download(id) {
    this.physicalPrintService.getPhysicalPrint(id).subscribe((res) => {
        window.open('http://localhost:4567/' + res.path);             // Update this to proper path.
      }
    );
  }
  private dismissDelete() {
    this.toBeDeleted = null;
    this.modalRef.hide();
  }

  private confirmDelete() {
    if (this.toBeDeleted) {
      this.physicalPrintService.deletePhysicalPrint(this.toBeDeleted).subscribe((res) => {
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
