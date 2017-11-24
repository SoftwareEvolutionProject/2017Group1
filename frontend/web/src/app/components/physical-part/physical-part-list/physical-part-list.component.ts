import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import {PhysicalPart} from '../../../model/physical-part';
import {PhysicalPartService} from '../../../services/physical-part/physical-part.service';
import {ErrorService} from '../../../services/error.service';

declare var $: any;

@Component({
  selector: 'app-physical-part-list',
  templateUrl: './physical-part-list.component.html',
  styleUrls: ['./physical-part-list.component.scss'],
  providers: [PhysicalPartService, ErrorService],
})
export class PhysicalPartListComponent implements OnInit, AfterViewInit {
  @Output() selected: EventEmitter<PhysicalPart> = new EventEmitter<PhysicalPart>();
  private table;
  private physicalParts: PhysicalPart[];

  private modalRef: BsModalRef;
  @ViewChild('modalDelete') modalDelete;
  private toBeDeleted: number = null;
  selectedPhysicalPart: PhysicalPart = null;

  constructor(private physicalPartService: PhysicalPartService,
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
    /* get all Physical Parts */
    this.physicalPartService.getPhysicalParts().subscribe(
      (physicalParts) => {
        this.physicalParts = physicalParts;

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
      title: 'ID',
      field: 'id',
      sortable: true,
    }, {
      title: 'Physical Print ID',
      field: 'physicalPrintID',
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
    this.physicalParts.forEach((physicalPart) => {
      data.push({
        physicalPrintID: physicalPart.physicalPrintID,
        orderedPartID: physicalPart.orderedPartID,
        magicsPartPairingID: physicalPart.magicsPartPairingID,
        id: physicalPart.id,
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
      _self.selected.emit(_self.physicalParts.filter((physicalPart) => { if (physicalPart.id === $element.id) { return physicalPart; } })[0]);
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
      this.physicalPartService.deletePhysicalPart(this.toBeDeleted).subscribe((res) => {
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
