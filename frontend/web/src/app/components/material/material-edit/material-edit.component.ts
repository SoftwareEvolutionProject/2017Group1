import {Location} from "@angular/common";
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Customer} from "../../../model/customer";
import {DigitalPart} from "../../../model/digital-part";
import {Material} from "../../../model/material";
import {MaterialedPart} from "../../../model/materialed-part";
import {CustomerService} from "../../../services/customer/customer.service";
import {DigitalPartService} from "../../../services/digital-part/digital-part.service";
import {ErrorService} from "../../../services/error.service";
import {MaterialService} from "../../../services/material/material.service";

declare var $: any;

@Component({
  selector: 'app-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.scss'],
  providers: [MaterialService, CustomerService, DigitalPartService, ErrorService],
})
export class MaterialEditComponent implements OnInit, OnChanges {
  @Input('material') material: Material = null;
  @Input('nav') nav = true;
  @Input('creating') creating = false;
  private customers: Customer[];
  private modalRef: BsModalRef;
  @ViewChild('modalCustomer') modalCustomer;
  materialedPartsFieldsForm: FormGroup[] = [];
  private digitalParts: DigitalPart[];
  @Output() changed: EventEmitter<Material> = new EventEmitter<Material>();
  private loaded = false;

  /* forms */
  private requiredFieldsForm: FormGroup = null;

  constructor(private modalService: BsModalService,
              private route: ActivatedRoute,
              private router: Router,
              private materialService: MaterialService,
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
    console.log("creating");
    /* init with a boilerplate */
    this.creating = true;
    if (this.creating) {
      this.material = new Material({});
      this.material.materialedParts = [];
    }
    this.populate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.creating) {
      this.create();
    } else if (this.material) {
      this.populate();
    }
  }

  /* get the product */
  getData(id) {
    this.materialService.getMaterial(id).subscribe(
      (material) => {
        this.material = material;
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
    this.constructMaterialedPartsForms();
    const fields = {
      customerID: [this.material && this.material.customerID ? this.material.customerID : '',
        Validators.compose([Validators.required])],
      date: [this.material && this.material.date ? this.material.date : '',
        Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.loaded = true;
  }

  private constructMaterialedPartsForms() {
    /* load attr with default data from product instance*/
    this.materialedPartsFieldsForm = [];

    this.material.materialedParts.forEach((materialedPart) => {
      this.materialedPartsFieldsForm.push(this.formBuilder.group({
        amount: [materialedPart.amount, Validators.compose([Validators.required])],
        digitalPartID: [materialedPart.digitalPartID, Validators.compose([Validators.required])],
      }));
    });
  }

  /* save product instance */
  save() {
    /* convert relevant fields */

    const id = this.material.id;
    const material: Material = new Material(this.requiredFieldsForm.value);
    material.date = this.requiredFieldsForm.get('date').value;

    this.creating ? delete material['id'] : material.id = id;
    const materialedParts: MaterialedPart[] = [];

    this.materialedPartsFieldsForm.forEach((formGroup) => {
      materialedParts.push(new MaterialedPart({
        digitalPartID: formGroup.value.digitalPartID,
        amount: formGroup.value.amount,
      }));
    });
    material.materialedParts = materialedParts;
    if (this.creating) { // a new product
      this.materialService.createMaterial(material).subscribe(
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
      this.materialService.updateMaterial(material).subscribe(
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

  createNewDigitalPart() {
    this.router.navigate(['digital-parts', 'create']);
  }

  addDigitalPart() {
    const fields = {
      digitalPartID: ['',
        Validators.compose([Validators.required])],
      amount: ['',
        Validators.compose([Validators.required])],
    };
    this.materialedPartsFieldsForm.push(this.formBuilder.group(fields));
  }

  deleteDigitalPart(option) {
    this.materialedPartsFieldsForm.splice(option, 1);
  }

  cancel() {
    if (this.nav) {
      this.back();
    }
    this.changed.emit(this.material);
  }

  back() {
    this._location.back();
  }

  digitalPartsValid(): boolean {
    let valid = true;
    if (this.materialedPartsFieldsForm.length === 0) {
      return false;
    }
    this.materialedPartsFieldsForm.forEach((formGroup) => {
      if (!formGroup.valid) {
        valid = false;
        return valid;
      }
    });
    return valid;
  }

  createCustomer() {
    this.router.navigate(['customers', 'create']);
  }
}
