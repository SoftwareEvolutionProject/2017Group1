import {Location} from "@angular/common";
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {DigitalPart} from "../../../model/digital-part";
import {DigitalPrint} from "../../../model/digital-print";
import {DigitalPrintService} from "../../../services/digital-print/digital-print.service";
import {ErrorService} from "../../../services/error.service";
import {DigitalPartService} from "../../../services/digital-part/digital-part.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Ng4FilesConfig, Ng4FilesSelected, Ng4FilesService, Ng4FilesStatus} from "angular4-files-upload";
declare var $: any;

@Component({
  selector: 'app-digital-print-edit',
  providers: [DigitalPrintService, ErrorService, DigitalPartService],
  templateUrl: './digital-print-edit.component.html',
  styleUrls: ['./digital-print-edit.component.scss'],
})
export class DigitalPrintEditComponent implements OnInit, OnChanges {

  @Input('digitalPrint') digitalPrint: DigitalPrint = null;
  @Input('nav') nav = true;
  @Input('creating') creating = false;
  private modalRef: BsModalRef;
  @ViewChild('modalError') modalDelete;
  @Output() changed: EventEmitter<DigitalPrint> = new EventEmitter<DigitalPrint>();
  private requiredFieldsForm: FormGroup = null;
  private loaded = false;
  public selectedFile;
  public selectedFileName;
  public errorMessage;
  private stlConfig: Ng4FilesConfig = {
    acceptExtensions: ['.magics'],
    maxFilesCount: 1,
    maxFileSize: 5120000,
    totalFilesSize: 10120000,
  };
  /* forms */
  magicPairingsFieldsForm: FormGroup[] = [];
  private digitalParts: DigitalPart[];

  constructor(private modalService: BsModalService,
              private route: ActivatedRoute,
              private digitalPrintService: DigitalPrintService,
              private digitalPartService: DigitalPartService,
              private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private _location: Location,
              private ng4FilesService: Ng4FilesService) {
  }

  ngOnInit(): void {
    this.ng4FilesService.addConfig(this.stlConfig);
    /* get parts */
    this.digitalPartService.getDigitalParts().subscribe((dParts) => {
      this.digitalParts = dParts;

      /* get route param n create or load */
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
      this.errorMessage = 'Only ".magics" files allowed!';
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
      this.digitalPrint = new DigitalPrint({'magicsPartPairing': {}});
    }
    this.populate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.creating) {
      this.create();
    } else if (this.digitalPrint) {
      this.populate();
    }
  }

  /* get the product */
  getData(id) {
    this.digitalPrintService.getDigitalPrint(id).subscribe(
      (digitalPrint) => {
        this.digitalPrint = digitalPrint;
        this.selectedFile = this.digitalPrint.path;
        this.populate();
      },
    );
  }

  private constructMagicPairingFormGroup() {
    /* load attr with default data from product instance*/
    this.magicPairingsFieldsForm = [];
    Object.getOwnPropertyNames(this.digitalPrint.magicsPartPairing).forEach((id) => {
      this.magicPairingsFieldsForm.push(this.formBuilder.group({
        magicsId: [id,
          Validators.compose([Validators.required])],
        digitalPart: [this.digitalPrint.magicsPartPairing[id] ? this.digitalPrint.magicsPartPairing[id] : '',
          Validators.compose([Validators.required])],
      }));
    });
    console.log(this.magicPairingsFieldsForm);
  }

  deleteMagicPairing(option) {
    this.magicPairingsFieldsForm.splice(option, 1);
  }

  addMagicPairing() {
    const fields = {
      magicsId: ['',
        Validators.compose([Validators.required])],
      digitalPart: ['',
        Validators.compose([Validators.required])],
    };
    this.magicPairingsFieldsForm.push(this.formBuilder.group(fields));
  }

  public pairingValid(): boolean {
    let valid = true;
    this.magicPairingsFieldsForm.forEach((formGroup) => {
      if (!formGroup.valid) {
        valid = false;
        return;
      }
    });
    return valid;
  }

  /* populate data */
  private populate() {
    this.constructForms()
    this.loaded = true;
  }
  private constructForms() {
    const fields = {
      name: [this.digitalPrint && this.digitalPrint.name ? this.digitalPrint.name : '',
        Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.constructMagicPairingFormGroup();
  }

  /* save product instance */
  save() {
    /* convert relevant fields */

    const id = this.digitalPrint.id;
    const digitalPrint: DigitalPrint = new DigitalPrint(this.requiredFieldsForm.value);
    this.creating ? delete digitalPrint['id'] : digitalPrint.id = id;

    const pairings = {};
    this.magicPairingsFieldsForm.forEach((formGroup) => {
      pairings[formGroup.get('magicsId').value] = parseInt(formGroup.get('digitalPart').value);
    });
    digitalPrint.magicsPartPairing = pairings;

    console.log(digitalPrint);

    if (this.creating) { // a new product
      this.digitalPrintService.createDigitalPrint(digitalPrint).subscribe(
        (data) => {
          this.digitalPrintService.uploadMagicsFile(data, this.selectedFile).subscribe(
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
      this.digitalPrintService.updateDigitalPrint(digitalPrint).subscribe(
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
    this.changed.emit(this.digitalPrint);
  }

  back() {
    this._location.back();
  }

}
