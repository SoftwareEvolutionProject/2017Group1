import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {DigitalPrint} from '../../../model/digital-print';
import {ErrorService} from '../../../services/error.service';
import {DigitalPrintService} from '../../../services/digital-print/digital-print.service';

declare var $: any;

@Component({
  selector: 'app-digital-print-list',
  templateUrl: './digital-print-list.component.html',
  styleUrls: ['./digital-print-list.component.scss'],
  providers: [DigitalPrintService, ErrorService],
})
export class DigitalPrintListComponent implements OnInit, AfterViewInit {
  private modalRef: BsModalRef;
  @ViewChild('modalDelete') modalDelete;
  private toBeDeleted: number = null;

  private table;
  @Input('digitalPrintID') digitalPrints: DigitalPrint [];
  @Output() selected: EventEmitter<DigitalPrint> = new EventEmitter<DigitalPrint>();


  constructor(private digitalPrintService: DigitalPrintService,
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
    this.digitalPrintService.getDigitalPrints().subscribe(
      (digitalPrints) => {
        this.digitalPrints = digitalPrints;

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
    const columns = [ {
      title: 'ID',
      field: 'id',
      sortable: true,
    }, {
      title: 'Name',
      field: 'name',
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
    this.digitalPrints.forEach((digitalPrint) => {
      data.push({
        name: digitalPrint.name,
        id: digitalPrint.id,
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
    (this.table as any).on('click-row.bs.table', (row, $element) => {
      _self.selected.emit(_self.digitalPrints.filter((digitalPrint) => {
        if (digitalPrint.id ===  $element.id) {
          return digitalPrint;
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
    this.digitalPrintService.getDigitalPrint(id).subscribe((res) => {
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
      this.digitalPrintService.deleteDigitalPrint(this.toBeDeleted).subscribe((res) => {
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
