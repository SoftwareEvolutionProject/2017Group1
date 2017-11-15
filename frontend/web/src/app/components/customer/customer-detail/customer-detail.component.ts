import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import {Customer} from '../../../model/customer';
import {CustomerService} from '../../../services/customer/customer.service';
import {ErrorService} from '../../../services/error.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  providers: [CustomerService, ErrorService],
})
export class CustomerDetailComponent implements OnInit, OnChanges {
  @Input('customer') customer: Customer = null;
  @Input('nav') nav = true;
  @Input('creating') creating = false;
  @Output() changed: EventEmitter<Customer> = new EventEmitter<Customer>();
  private loaded = false;

  /* forms */
  private requiredFieldsForm: FormGroup = null;

  constructor(private route: ActivatedRoute,
              private customerService: CustomerService,
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
    if (this.creating) { this.customer = new Customer({}); }
    this.populate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.creating) {
      this.create();
    } else if (this.customer) {
      this.populate();
    }
  }

  /* get the product */
  getData(id) {
    this.customerService.getCustomer(id).subscribe(
      (customer) => {
        this.customer = customer;
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
      name: [this.customer && this.customer.name ? this.customer.name : '',
      Validators.compose([Validators.required])],
      eMail: [this.customer && this.customer.eMail ? this.customer.eMail : '',
      Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.loaded = true;
  }

  /* save product instance */
  save() {
    /* convert relevant fields */

    const id = this.customer.id;
    const customer: Customer = new Customer(this.requiredFieldsForm.value);
    this.creating ? delete customer['id'] : customer.id = id;

    if (this.creating) { // a new product
      this.customerService.createCustomer(customer).subscribe(
        (data) => {
          if (this.nav) { this.back(); }
          this.changed.emit(data);
        }, (error) => {
          console.log(error);
          this.errorService.showAlert(error.verobose_message_header, error.verbose_message);
        },
      );
    } else {
      this.customerService.updateCustomer(customer).subscribe(
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
    this.changed.emit(this.customer);
  }

  back() {
    this._location.back();
  }
}
