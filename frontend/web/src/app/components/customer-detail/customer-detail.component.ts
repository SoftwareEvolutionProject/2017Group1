import { Component, OnInit } from '@angular/core';
import {Customer} from "../../model/customer";
import {CustomerMockService} from "../../services/customer/customer-mock.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ErrorService} from "../../services/error.service";
import {Location} from '@angular/common';
import {CustomerService} from "../../services/customer/customer.service";

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  providers: [CustomerService, ErrorService]
})
export class CustomerDetailComponent implements OnInit {
  private loaded : boolean = false;
  private creating: boolean = false;

  /* forms */
  private requiredFieldsForm: FormGroup = null;

  /* data */
  private customer: Customer = null;

  constructor(
    private route: ActivatedRoute,
    private customerService : CustomerService,
    private formBuilder: FormBuilder,
    private errorService : ErrorService,
    private _location: Location) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if(!id || id == "create"){ //new product is being created
        this.creating = true;
        /* init with a boilerplate */
        if(this.creating)this.customer = new Customer({});
        this.populate();
      }
      else if(id)
        this.getData(id);
    });
  }

  ngAfterViewInit() {
  }


  /* get the product */
  getData(id){
    this.customerService.getCustomer(id).subscribe(
      customer => {
        this.customer = customer;
        this.populate();
      }
    )
  }

  /* populate data */
  private populate(){
    this.constructForms();
  }

  /* init forms */
  private constructForms() {
    let fields = {
      name: [this.customer && this.customer.name?this.customer.name:'',
      Validators.compose([Validators.required])],
      eMail: [this.customer && this.customer.eMail?this.customer.eMail:'',
        Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.loaded = true;
  }


  /* save product instance */
  save() {
    /* convert relevant fields */

    let id = this.customer.id;
    let customer: Customer = new Customer(this.requiredFieldsForm.value);
    this.creating?delete customer["id"]:customer.id = id;

    console.log(customer);

    if(this.creating) { // a new product
      this.customerService.createCustomer(customer).subscribe(
        data => {
          this.back();
        }, error => {
          console.log(error);
          this.errorService.showAlert(error.verobose_message_header, error.verbose_message);
        }
      );
    } else {
      this.customerService.updateCustomer(customer).subscribe(
        data => {
          this.back();
        }, error => {
          console.log(error);
          this.errorService.showAlert(error.verobose_message_header, error.verbose_message);
        }
      );
    }
  }

  back(){
    this._location.back();
  }
}
