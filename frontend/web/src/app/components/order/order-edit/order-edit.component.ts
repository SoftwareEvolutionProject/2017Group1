import {Location} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Customer} from '../../../model/customer';
import {DigitalPart} from '../../../model/digital-part';
import {Order} from '../../../model/order';
import {OrderedPart} from '../../../model/ordered-part';
import {CustomerService} from '../../../services/customer/customer.service';
import {DigitalPartService} from '../../../services/digital-part/digital-part.service';
import {ErrorService} from '../../../services/error.service';
import {OrderService} from '../../../services/order/order.service';

declare var $: any;

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss'],
  providers: [OrderService, CustomerService, DigitalPartService, ErrorService],
})
export class OrderEditComponent implements OnInit, OnChanges {
  @Input('order') order: Order = null;
  @Input('nav') nav = true;
  @Input('creating') creating = false;
  private customers: Customer[];
  private modalRef: BsModalRef;
  @ViewChild('modalCustomer') modalCustomer;
  orderedPartsFieldsForm: FormGroup[] = [];
  private digitalParts: DigitalPart[];
  @Output() changed: EventEmitter<Order> = new EventEmitter<Order>();
  private loaded = false;

  /* forms */
  private requiredFieldsForm: FormGroup = null;

  constructor(private modalService: BsModalService,
              private route: ActivatedRoute,
              private orderService: OrderService,
              private customerService: CustomerService,
              private digitalPartService: DigitalPartService,
              private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private _location: Location) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.customerService.getCustomers().subscribe(
        (customers) => {
          this.digitalPartService.getDigitalParts().subscribe(
            (digitalParts) => {
              this.customers = customers;
              this.digitalParts = digitalParts;
              const id = params['id'];
              if (id === 'create') { // new product is being created
                this.create();
              } else if (id) {
                this.getData(id);
              }
            });

        },
      );
    });
  }

  create() {
    /* init with a boilerplate */
    this.creating = true;
    if (this.creating) {
      this.order = new Order({});
    }
    this.populate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.creating) {
      this.create();
    } else if (this.order) {
      this.populate();
    }
  }

  /* get the product */
  getData(id) {
    this.orderService.getOrder(id).subscribe(
      (order) => {
        this.order = order;
        this.populate();
      },
    );
  }

  /* populateDigitlParts data */
  private populate() {
    this.constructForms();
  }

  /* init forms */
  private constructForms() {
    this.constructOrderedPartsForms();
    const fields = {
      customerID: [this.order && this.order.customerID ? this.order.customerID : '',
        Validators.compose([Validators.required])],
      date: [this.order && this.order.date ? this.order.date : '',
        Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.loaded = true;
  }

  private constructOrderedPartsForms() {
    /* load attr with default data from product instance*/
    this.orderedPartsFieldsForm = [];
    console.log(this.order.orderedParts)
    Object.getOwnPropertyNames(this.order.orderedParts).forEach((index) => {
      this.orderedPartsFieldsForm.push(this.formBuilder.group({
        amount: [this.order.orderedParts[index] ? this.order.orderedParts[index].amount : '', Validators.compose([Validators.required])],
        digitalPart: [this.order.orderedParts[index] ? this.order.orderedParts[index].digitalPartID : '',
          Validators.compose([Validators.required])],
      }));
    });
  }

  /* save product instance */
  save() {
    /* convert relevant fields */

    const id = this.order.id;
    const order: Order = new Order(this.requiredFieldsForm.value);
    order.date = this.requiredFieldsForm.get('date').value;

    this.creating ? delete order['id'] : order.id = id;
    const orderedParts: OrderedPart[] = [];
    this.orderedPartsFieldsForm.forEach((formGroup) => {
      orderedParts.push(new OrderedPart({
        digitalPartID: formGroup.get('digitalPart').value.digitalPartID,
        amount: formGroup.get('amount').value,
      }));
    });
    order.orderedParts = orderedParts;
    if (this.creating) { // a new product
      this.orderService.createOrder(order).subscribe(
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
      this.orderService.updateOrder(order).subscribe(
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

  addDigitalPart() {
    const fields = {
      digitalPart: ['',
        Validators.compose([Validators.required])],
      amount: ['',
        Validators.compose([Validators.required])],
    };
    this.orderedPartsFieldsForm.push(this.formBuilder.group(fields));
  }

  deleteDigitalPart(option) {
    this.orderedPartsFieldsForm.splice(option, 1);
  }

  cancel() {
    if (this.nav) {
      this.back();
    }
    this.changed.emit(this.order);
  }

  back() {
    this._location.back();
  }

  openModal(autoFocusIdWithHashtag: string) {
    this.modalRef = this.modalService.show(this.modalCustomer);
    if (autoFocusIdWithHashtag != null && autoFocusIdWithHashtag !== '') {
      const addInput: any = ($(autoFocusIdWithHashtag) as any);
      setTimeout(() => {
        addInput.focus();
      }, 200);
    }
  }
}
