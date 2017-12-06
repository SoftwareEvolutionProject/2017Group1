import {Location} from "@angular/common";
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Customer} from "../../../model/customer";
import {DigitalPart} from "../../../model/digital-part";
import {Material} from "../../../model/material";
import {CustomerService} from "../../../services/customer/customer.service";
import {DigitalPartService} from "../../../services/digital-part/digital-part.service";
import {ErrorService} from "../../../services/error.service";
import {MaterialService} from "../../../services/material/material.service";
import {MaterialGrade} from "../../../model/material-grade";

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
  private modalRef: BsModalRef;
  @ViewChild('modalMaterial') modalMaterial;
  materialGradeFieldsForm: FormGroup[] = [];
  private digitalParts: DigitalPart[];
  @Output() changed: EventEmitter<Material> = new EventEmitter<Material>();
  private loaded = false;

  /* forms */
  private requiredFieldsForm: FormGroup = null;

  constructor(private modalService: BsModalService,
              private route: ActivatedRoute,
              private router: Router,
              private materialService: MaterialService,
              private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private _location: Location) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
            const id = params['id'];
            if (id === 'create') { // new material is being created
              this.create();
            } else if (id) {
              this.getData(id);
            }
    });
  }

  create() {
    console.log("creating");
    /* init with a boilerplate */
    this.creating = true;
    if (this.creating) {
      this.material = new Material({});
      this.material.materialGrades = new Array<MaterialGrade>();
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
    this.constructMaterialGradeForms();
    const fields = {
      name: [this.material && this.material.name ? this.material.name : '',
        Validators.compose([Validators.required])],
      supplierName: [this.material && this.material.supplierName ? this.material.supplierName : '',
        Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.loaded = true;
  }

  private constructMaterialGradeForms() {
    /* load attr with default data from product instance*/
    this.materialGradeFieldsForm = [];

    this.material.materialGrades.forEach((materialGrade) => {
      this.materialGradeFieldsForm.push(this.formBuilder.group({
        amount: [materialGrade.amount, Validators.compose([Validators.required])],
        digitalPartID: [materialGrade.id, Validators.compose([Validators.required])],
      }));
    });
  }

  /* save product instance */
  save() {
    /* convert relevant fields */

    const id = this.material.id;
    const material: Material = new Material(this.requiredFieldsForm.value);

    this.creating ? delete material['id'] : material.id = id;
    const materalGrades: MaterialGrade[] = new Array<MaterialGrade>();

    this.materialGradeFieldsForm.forEach((formGroup) => {
      materalGrades.push(new MaterialGrade({
        id: formGroup.value.id,
        amount: formGroup.value.amount,
      }));
    });
    material.materialGrades = materalGrades;
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

  addMaterialGrade() {
    const fields = {
      digitalPartID: ['',
        Validators.compose([Validators.required])],
      amount: ['',
        Validators.compose([Validators.required])],
    };
    this.materialGradeFieldsForm.push(this.formBuilder.group(fields));
  }

  deleteMaterialGrade(option) {
    this.materialGradeFieldsForm.splice(option, 1);
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

  materialGradesValid(): boolean {
    let valid = true;
    if (this.materialGradeFieldsForm.length === 0) {
      return false;
    }
    this.materialGradeFieldsForm.forEach((formGroup) => {
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
