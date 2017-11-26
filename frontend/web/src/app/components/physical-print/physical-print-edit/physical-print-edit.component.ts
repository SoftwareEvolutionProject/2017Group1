import {Location} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PhysicalPrint} from '../../../model/physical-print';
import {ErrorService} from '../../../services/error.service';
import {PhysicalPrintService} from '../../../services/physical-print/physical-print.service';
import {DigitalPrintService} from "../../../services/digital-print/digital-print.service";
import {DigitalPrint} from "../../../model/digital-print";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Ng4FilesConfig, Ng4FilesSelected, Ng4FilesService, Ng4FilesStatus} from "angular4-files-upload";
declare var $: any;

@Component({
  selector: 'app-physical-print-edit',
  providers: [PhysicalPrintService, ErrorService, DigitalPrintService],
  templateUrl: './physical-print-edit.component.html',
  styleUrls: ['./physical-print-edit.component.scss'],
})
export class PhysicalPrintEditComponent implements OnInit, OnChanges {
  digitalPrints: DigitalPrint[];

  @Input('physicalPrint') physicalPrint: PhysicalPrint = null;
  @Input('nav') nav = true;
  @Input('creating') creating = false;
  private modalRef: BsModalRef;
  @ViewChild('modalError') modalDelete;
  @Output() changed: EventEmitter<PhysicalPrint> = new EventEmitter<PhysicalPrint>();
  private loaded = false;
  public selectedFile;
  public selectedFileName;
  public errorMessage;
  private slmConfig: Ng4FilesConfig = {
    acceptExtensions: ['.slm'],
    maxFilesCount: 1,
    maxFileSize: 5120000,
    totalFilesSize: 10120000,
  };

  /* forms */
  private requiredFieldsForm: FormGroup = null;

  constructor(private modalService: BsModalService,
              private route: ActivatedRoute,
              private physicalPrintService: PhysicalPrintService,
              private digitalPrintService: DigitalPrintService,
              private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private _location: Location,
              private ng4FilesService: Ng4FilesService) {
  }

  ngOnInit(): void {
    this.ng4FilesService.addConfig(this.slmConfig);
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id === 'create') { // new product is being created
        this.create();
      } else if (id) {
        this.getData(id);
      }
    });
  }

  public filesSelect(selectedFiles: Ng4FilesSelected): void {
    if (selectedFiles.status === Ng4FilesStatus.STATUS_SUCCESS) {
      this.selectedFile = selectedFiles.files[0];
      this.selectedFileName = this.selectedFile.name;
    } else if (selectedFiles.status === Ng4FilesStatus.STATUS_MAX_FILE_SIZE_EXCEED) {
      this.errorMessage = 'Max file size exceeded';
      this.openModal('#errorFormDismissBtn');
    } else if (selectedFiles.status === Ng4FilesStatus.STATUS_NOT_MATCH_EXTENSIONS) {
      this.errorMessage = 'Only ".slm" files allowed!';
      this.openModal('#errorFormDismissBtn');
    }
  }

  private dismissError() {
    this.modalRef.hide();
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
  create() {
    /* init with a boilerplate */
    this.creating = true;
    if (this.creating) {
      this.physicalPrint = new PhysicalPrint({});
    }
    this.populate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.creating) {
      this.create();
    } else if (this.physicalPrint) {
      this.populate();
    }
  }

  /* get the product */
  getData(id) {
    this.physicalPrintService.getPhysicalPrint(id).subscribe(
      (physicalPrint) => {
        this.physicalPrint = physicalPrint;
        this.populate();
      },
    );
  }

  /* populate data */
  private populate() {
    /* get d prints */
    this.digitalPrintService.getDigitalPrints().subscribe((dPrints) => {
      this.digitalPrints = dPrints;
      this.constructForms();
    });
  }

  /* init forms */
  private constructForms() {
    const fields = {
      digitalPrintID: [this.physicalPrint && this.physicalPrint.digitalPrintID ? this.physicalPrint.digitalPrintID : '',
        Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.loaded = true;
  }

  /* save product instance */
  save() {
    /* convert relevant fields */

    const id = this.physicalPrint.id;

    this.requiredFieldsForm.value.digitalPrintID = parseInt(this.requiredFieldsForm.get('digitalPrintID').value);
    const physicalPrint: PhysicalPrint = new PhysicalPrint(this.requiredFieldsForm.value);

    this.creating ? delete physicalPrint['id'] : physicalPrint.id = id;

    if (this.creating) { // a new product
      this.physicalPrintService.createPhysicalPrint(physicalPrint).subscribe(
        (data) => {
          this.physicalPrintService.uploadSlmFile(data, this.selectedFile).subscribe(
            (response) => {
              if (this.nav) {
                this.back();
              }
              this.changed.emit(data);
            });
        }, (error) => {
          console.log(error);
          this.errorService.showAlert(error.verobose_message_header, error.verbose_message);
        },
      );
    } else {
      this.physicalPrintService.updatePhysicalPrint(physicalPrint).subscribe(
        (data) => {
            if (this.nav) {
            this.back();
          }
          this.changed.emit(data);
        }, (error) => {
          console.log(error);
          this.errorService.showAlert(error.verobose_message_header, error.verbose_message);
        },
      );
    }
  }

  cancel() {
    if (this.nav) {
      this.back();
    }
    this.changed.emit(this.physicalPrint);
  }

  back() {
    this._location.back();
  }

}
