import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DigitalPart } from '../../../model/digital-part';
import { DigitalPartService } from '../../../services/digital-part/digital-part.service';
import { ErrorService } from '../../../services/error.service';

import {Customer} from '../../../model/customer';
import {CustomerService} from '../../../services/customer/customer.service';

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
  private loaded = false;
  /* forms */
  private requiredFieldsForm: FormGroup = null;

  private customers: Customer[];
  /* data */

  constructor(
    private route: ActivatedRoute,
    private digitalPartService: DigitalPartService,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private _location: Location) { }

  ngOnInit(): void {
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

  create() {
    /* init with a boilerplate */
    this.creating = true;
    if (this.creating) { this.digitalPart = new DigitalPart({}); }
    console.log(this.digitalPart);
    this.populate();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.customerService.getCustomers().subscribe((customers) => {
      this.customers = customers;
      if (this.creating) {
        this.create();
      } else if (this.digitalPart) {
        this.populate();
      }
    });
  }
  /* get the product */
  getData(id) {
    this.digitalPartService.getDigitalPart(id).subscribe(
      (digitalPart) => {
        this.digitalPart = digitalPart;
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
    console.log(this.digitalPart);
    const fields = {
      name: [this.digitalPart && this.digitalPart.name ? this.digitalPart.name : '',
      Validators.compose([Validators.required])],
      id: [{ value: (this.digitalPart && this.digitalPart.id ? this.digitalPart.id : ''), disabled: true },
      Validators.compose([Validators.required])],
      customer: [this.customers[this.digitalPart.customerID] ? this.customers[this.digitalPart.customerID] : '',
        Validators.compose([Validators.required])],
      stlFile: [this.digitalPart && this.digitalPart.stlFile ? this.digitalPart.stlFile : '',
      Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.loaded = true;
  }
   /* save product instance */
   save() {
    /* convert relevant fields */

    const id = this.digitalPart.id;
    const digitalPart: DigitalPart = new DigitalPart(this.requiredFieldsForm.value);
    this.creating ? delete digitalPart['id'] : digitalPart.id = id;

    if (this.creating) { // a new product
      this.digitalPartService.createDigitalPart(digitalPart).subscribe(
        (data) => {
          if (this.nav) { this.back(); }
          this.changed.emit(data);
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
