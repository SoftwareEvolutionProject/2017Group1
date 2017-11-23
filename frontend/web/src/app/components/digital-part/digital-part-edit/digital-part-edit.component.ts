import { Location } from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {  Ng4FilesConfig,  Ng4FilesSelected, Ng4FilesService, Ng4FilesStatus} from 'angular4-files-upload';
import { DigitalPart } from '../../../model/digital-part';
import { DigitalPartService } from '../../../services/digital-part/digital-part.service';
import { ErrorService } from '../../../services/error.service';

import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Customer} from '../../../model/customer';
import {CustomerService} from '../../../services/customer/customer.service';
declare var $: any;

@Component({
  selector: 'app-digital-part-detail',
  templateUrl: './digital-part-edit.component.html',
  styleUrls: ['./digital-part-edit.component.scss'],
  providers: [DigitalPartService, CustomerService, ErrorService],
})
export class DigitalPartEditComponent implements OnInit, OnChanges {

  @Input('digitalPart') digitalPart: DigitalPart = null;
  @Input('nav') nav = true;
  @Input('creating') creating = false;
  @Output() changed: EventEmitter<DigitalPart> = new EventEmitter<DigitalPart>();
  private modalRef: BsModalRef;
  @ViewChild('modalError') modalDelete;
  private loaded = false;
  public selectedFile;
  public selectedFileName;
  public selectedName;
  public errorMessage;
  /* forms */

  private requiredFieldsForm: FormGroup = null;
  private customer: Customer;
  private customers: Customer[];

  private stlConfig: Ng4FilesConfig = {
    acceptExtensions: ['stl'],
    maxFilesCount: 1,
    maxFileSize: 5120000,
    totalFilesSize: 10120000,
  };

  /* data */

  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private digitalPartService: DigitalPartService,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private _location: Location,
    private ng4FilesService: Ng4FilesService) { }

  ngOnInit(): void {
    this.ng4FilesService.addConfig(this.stlConfig);
    this.customerService.getCustomers().subscribe((customers) => {
      this.customers = customers;
      this.route.params.subscribe((params) => {
        const id = params['id'];
        if (id === 'create') { // new product is being created
          this.create();
        } else if (id) {
          this.getData(id);
        }
      });
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
      this.errorMessage = 'Only ".stl" files allowed!';
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
    if (this.creating) { this.digitalPart = new DigitalPart({}); }
    this.populate();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.customer);
    this.customerService.getCustomers().subscribe((customers) => {
      this.customers = customers;
      if (this.creating) {
        this.create();
      } else if (this.digitalPart) {
        this.populate();
      }
    });
  }
  update(id) {
    console.log(id);
    this.digitalPart.customerID = id;
  }
  /* get the product */
  getData(id) {
    this.digitalPartService.getDigitalPart(id).subscribe(
      (digitalPart) => {
        this.digitalPart = digitalPart;
        this.selectedFileName = digitalPart.path;
        this.populate();
      },
    );
  }

  /* populate data */
  private populate() {
    this.constructForms();
  }
  private constructCustomerForm() {

  }
  /* init forms */
  private constructForms() {
    const fields = {
      name: [this.digitalPart && this.digitalPart.name ? this.digitalPart.name : '',
      Validators.compose([Validators.required])],
      id: [{ value: (this.digitalPart && this.digitalPart.id ? this.digitalPart.id : ''), disabled: true },
      Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.loaded = true;
  }
   /* save product instance */
   save() {
    /* convert relevant fields */
    const id = this.digitalPart.id;
    const data = this.requiredFieldsForm.value;
    data.customerID = this.digitalPart.customerID;
    data.stlFileName = this.selectedFileName;

    const digitalPart: DigitalPart = new DigitalPart(data);
    this.creating ? delete digitalPart['id'] : digitalPart.id = id;

    if (this.creating) { // a new product
      this.digitalPartService.createDigitalPart(digitalPart).subscribe(
        (data) => {
          this.digitalPartService.uploadStlFile(data, this.selectedFile).subscribe(
            (response) => {
              if (this.nav) { this.back(); }
              this.changed.emit(data);
            }
          );
        }, (error) => {
          console.log(error);
          this.errorService.showAlert(error.verobose_message_header, error.verbose_message);
        },
      );
    } else {
      this.digitalPartService.updateDigitalPart(digitalPart).subscribe(
        (data) => {

            if (this.nav) { this.back(); }
            this.changed.emit(data);

        }, (error) => {
          console.log(error);
          this.errorService.showAlert(error.verobose_message_header, error.verbose_message);
        },
      );
    }
  }

  cancel() {
    if (this.nav) { this.back(); }
    this.changed.emit(this.digitalPart);
  }

  back() {
    this._location.back();
  }
}
