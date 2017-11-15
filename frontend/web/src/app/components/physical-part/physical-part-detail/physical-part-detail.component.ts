import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import {PhysicalPart} from '../../../model/physical-part';
import {PhysicalPartService} from '../../../services/physical-part/physical-part.service';
import {ErrorService} from '../../../services/error.service';

@Component({
  selector: 'app-physical-part-detail',
  templateUrl: './physical-part-detail.component.html',
  styleUrls: ['./physical-part-detail.component.scss'],
  providers: [PhysicalPartService, ErrorService],
})
export class PhysicalPartDetailComponent implements OnInit, OnChanges {
  @Input('physicalPart') physicalPart: PhysicalPart = null;
  @Input('nav') nav = true;
  @Input('creating') creating = false;
  @Output() changed: EventEmitter<PhysicalPart> = new EventEmitter<PhysicalPart>();
  private loaded = false;

  /* forms */
  private requiredFieldsForm: FormGroup = null;

  constructor(private route: ActivatedRoute,
              private physicalPartService: PhysicalPartService,
              private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private _location: Location) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id === 'create') { // new product is being created
        this.create();
      } else if (id) {
        this.getData(id);
      }
    });
  }

  create() {
    /* init with a boilerplate */
    this.creating = true;
    if (this.creating) { this.physicalPart = new PhysicalPart({}); }
    this.populate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.creating) {
      this.create();
    } else if (this.physicalPart) {
      this.populate();
    }
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

  /* init forms */
  private constructForms() {
    const fields = {
      physicalPrintID: [this.physicalPart && this.physicalPart.physicalPrintID ? this.physicalPart.physicalPrintID : '',
      Validators.compose([Validators.required])],
      orderedPartID: [this.physicalPart && this.physicalPart.orderedPartID ? this.physicalPart.orderedPartID : '',
      Validators.compose([Validators.required])],
      magicsPartPairingID: [this.physicalPart && this.physicalPart.magicsPartPairingID ? this.physicalPart.magicsPartPairingID : '',
        Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.loaded = true;
  }

  /* save product instance */
  save() {
    /* convert relevant fields */

    const id = this.physicalPart.id;
    const physicalPart: PhysicalPart = new PhysicalPart(this.requiredFieldsForm.value);
    this.creating ? delete physicalPart['id'] : physicalPart.id = id;

    console.log(physicalPart);

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
}
