import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PhysicalPart } from '../../../model/physical-part';
import { PhysicalPartService } from '../../../services/physical-part/physical-part.service';
import { ErrorService } from '../../../services/error.service';
import { PhysicalPrintService } from '../../../services/physical-print/physical-print.service';
import { DigitalPrintService } from "../../../services/digital-print/digital-print.service";

import { PhysicalPrint } from '../../../model/physical-print';
import { DigitalPrint } from "../../../model/digital-print";

@Component({
  selector: 'app-physical-part-detail',
  templateUrl: './physical-part-edit.component.html',
  styleUrls: ['./physical-part-edit.component.scss'],
  providers: [PhysicalPartService, PhysicalPrintService, DigitalPrintService, ErrorService],
})
export class PhysicalPartEditComponent implements OnInit, OnChanges {

  @Input('physicalPart') physicalPart: PhysicalPart = null;
  @Input('nav') nav = true;
  @Input('creating') creating = false;
  @Output() changed: EventEmitter<PhysicalPart> = new EventEmitter<PhysicalPart>();
  private loaded = false;
  /* forms */

  private requiredFieldsForm: FormGroup = null;
  private physicalPrint: PhysicalPrint;
  private physicalPrints: PhysicalPrint[];
  private digitalPrint: DigitalPrint;
  private magicsPartIDs: String[];

  /* data */

  constructor(
    private route: ActivatedRoute,
    private physicalPartService: PhysicalPartService,
    private formBuilder: FormBuilder,
    private physicalPrintService: PhysicalPrintService,
    private digitalPrintService: DigitalPrintService,
    private errorService: ErrorService,
    private _location: Location) { }

  ngOnInit(): void {
    this.physicalPrintService.getAllPhysicalPrint().subscribe((physicalPrints) => {
      this.physicalPrints = physicalPrints;
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
    if (this.creating) { this.physicalPart = new PhysicalPart({}); }
    this.populate();
  }

  ngOnChanges(change: SimpleChanges) {
    console.log('ON CHANGE: ' + this.physicalPrint);
  }

  update(id) {
    console.log('UPDATE: ' + id)
    this.physicalPart.id = id;
  }

  /* get the product */
  getData(id) {
    this.physicalPartService.getPhysicalPart(id).subscribe(
      (physicalPart) => {
        this.physicalPart = physicalPart;
        this.populate();
      },
    );
  }

  /* populate data */
  private populate() {
    this.constructForms();
  }

  private constructPhysicalPrintForm() {

  }
  /* init forms */
  private constructForms() {
    const fields = {
      id: [ { value: (this.physicalPart && this.physicalPart.id ? this.physicalPart.id : ''), disabled: true },
        Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.loaded = true;
  }
   /* save product instance */
   save() {
    /* convert relevant fields */
    const id = this.physicalPart.id;
    const data = this.requiredFieldsForm.value;
    data.physicalPrintID = this.physicalPart.physicalPrintID;

    const physicalPart: PhysicalPart = new PhysicalPart(this.requiredFieldsForm.value);
    this.creating ? delete physicalPart['id'] : physicalPart.id = id;

    if (this.creating) { // a new product
      this.physicalPartService.createPhysicalPart(physicalPart).subscribe(
        (data) => {
          if (this.nav) { this.back(); }
          this.changed.emit(data);
        }, (error) => {
          console.log(error);
          this.errorService.showAlert(error.verobose_message_header, error.verbose_message);
        },
      );
    } else {
      this.physicalPartService.updatePhysicalPart(physicalPart).subscribe(
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
    this.changed.emit(this.physicalPart);
  }

  back() {
    this._location.back();
  }

  updateMagicsPartPairingIDs(value) {
    this.physicalPrintService.getPhysicalPrint(value).subscribe(
      (physicalPrint) => {
        this.physicalPrint = physicalPrint;
        this.digitalPrintService.getDigitalPrint(this.physicalPrint.digitalPrintID).subscribe((digitalPrint) => {
          this.digitalPrint = digitalPrint;
          this.magicsPartIDs = Object.keys(this.digitalPrint.magicsPartPairing);
        });
    });
  }

  updateOrderedPartIDs(value) {

  }
}
