import {Location} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {DigitalPart} from '../../../model/digital-part';
import {DigitalPrint} from '../../../model/digital-print';
import {DigitalPartMockService as DigitalPartService} from '../../../services/digital-part/digital-part-mock.service';
import {DigitalPrintService} from '../../../services/digital-print/digital-print.service';
import {ErrorService} from '../../../services/error.service';

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
  @Output() changed: EventEmitter<DigitalPrint> = new EventEmitter<DigitalPrint>();

  private loaded = false;

  /* forms */
  private requiredFieldsForm: FormGroup = null;
  magicPairingsFieldsForm: FormGroup[] = [];
  private digitalParts: DigitalPart[];

  constructor(private route: ActivatedRoute,
              private digitalPrintService: DigitalPrintService,
              private digitalPartService: DigitalPartService,
              private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private _location: Location) {
  }

  ngOnInit(): void {
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

  create() {
    /* init with a boilerplate */
    this.creating = true;
    if (this.creating) {
      this.digitalPrint = new DigitalPrint({'magicsPartPairing':{}});
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
        this.populate();
      },
    );
  }

  private constructMagicPairingFormGroup(){
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
    this.constructForms();
  }

  /* init forms */
  private constructForms() {
    const fields = {
      magicsPath: [this.digitalPrint && this.digitalPrint.magicsPath ? this.digitalPrint.magicsPath : '',
        Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.constructMagicPairingFormGroup();
    this.loaded = true;
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
    console.log(JSON.stringify(digitalPrint));

    if (this.creating) { // a new product
      this.digitalPrintService.createDigitalPrint(digitalPrint).subscribe(
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
