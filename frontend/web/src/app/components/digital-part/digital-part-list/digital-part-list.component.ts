import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DigitalPart } from '../../../model/digital-part';
import { DigitalPartService } from '../../../services/digital-part/digital-part.service';
import { ErrorService } from '../../../services/error.service';
import {HttpClient} from "../../../services/http/http.client";
declare var $: any;

@Component({
  selector: 'app-digital-part-list',
  templateUrl: './digital-part-list.component.html',
  styleUrls: ['./digital-part-list.component.scss'],
  providers: [DigitalPartService, ErrorService],
})
export class DigitalPartListComponent implements OnInit, AfterViewInit {
  @Output() selectedDigitalPart: EventEmitter<DigitalPart> = new EventEmitter<DigitalPart>();
  private table;
  private digitalParts: DigitalPart[];
  private modalRef: BsModalRef;
  @ViewChild('modalDelete') modalDelete;
  private toBeDeleted: number = null;

  constructor(private digitalPartService: DigitalPartService,
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
    /* getPhysicalPrint users */
    this.digitalPartService.getDigitalParts().subscribe(
      (digitalParts) => {
        this.digitalParts = digitalParts;
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
        'click .edit'(e, value, row, index) {
          _self.router.navigate([_self.router.url, row.id]);
        },
        'click .download'(e, value, row, index) {
          _self.download(row.id);
        },
        'click .delete'(e, value, row, index) {
          _self.delete(row.id);
        },
      },
      formatter: this.operateFormatter,
    }];

    const data = [];
    this.digitalParts.forEach((digitalPart) => {
      data.push({
        name: digitalPart.name,
        id: digitalPart.id,
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
      _self.selectedDigitalPart.emit(_self.digitalParts.filter((digtialPart) => { if (digtialPart.id === $element.id) { return digtialPart; } })[0]);
    });
  }

  private amountFormatter(value, row, index) {
    return value > 0 ? '' : {
      css: { 'background-color': 'rgba(255, 0, 0, 0.4)' },
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
    this.digitalPartService.getDigitalPart(id).subscribe((res) => {
        window.open(HttpClient.baseUrl + res.path);
      }
    );
  }
  private dismissDelete() {
    this.toBeDeleted = null;
    this.modalRef.hide();
  }

  private confirmDelete() {
    if (this.toBeDeleted) {
      this.digitalPartService.deleteDigitalPart(this.toBeDeleted).subscribe((res) => {
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
