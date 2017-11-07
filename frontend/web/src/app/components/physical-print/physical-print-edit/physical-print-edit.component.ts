import {Location} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {PhysicalPrintService} from '../../../services/physical-print/physical-print.service';
import {PhysicalPrint} from '../../../model/physical-print';
import {ErrorService} from '../../../services/error.service';

@Component({
  selector: 'app-physical-print-edit',
  templateUrl: './physical-print-edit.component.html',
  styleUrls: ['./physical-print-edit.component.scss']
})
export class PhysicalPrintEditComponent implements OnInit {

  @Input('physicalPrint') physicalPrint: PhysicalPrint = null;
  @Input('nav') nav = true;
  @Input('creating') creating = false;
  @Output() changed: EventEmitter<PhysicalPrint> = new EventEmitter<PhysicalPrint>();
  private loaded = false;

  /* forms */
  private requiredFieldsForm: FormGroup = null;

  constructor(private route: ActivatedRoute,
              private physicalPrintService: PhysicalPrintService,
              private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private _location: Location) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id == 'create') { //new product is being created
        this.create();
      }
      else if (id)
        this.getData(id);
    });
  }

  ngAfterViewInit() {
  }

  create() {
    /* init with a boilerplate */
    this.creating = true;
    if (this.creating) this.physicalPrint = new PhysicalPrint({});
    this.populate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.creating) {
      this.create();
    } else if (this.physicalPrint) {
      this.populate();
    }
  }

  /* get the product */
  getData(id) {
    this.physicalPrintService.getPhysicalPrint(id).subscribe(
      (physicalPrint) => {
        this.physicalPrint = physicalPrint;
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
      name: [this.physicalPrint && this.physicalPrint.name ? this.physicalPrint.name : '',
        Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.loaded = true;
  }

  /* save product instance */
  save() {
    /* convert relevant fields */

    const id = this.physicalPrint.id;
    const physicalPrint: PhysicalPrint = new PhysicalPrint(this.requiredFieldsForm.value);
    this.creating ? delete physicalPrint['id'] : physicalPrint.id = id;

    console.log(physicalPrint);

    if (this.creating) { // a new product
<<<<<<< HEAD
      this.physicalPrint.createPhysicalPrint(physicalPrint).subscribe(
=======
      this.physicalPrintService.createPhysicalPrint(physicalPrint).subscribe(
>>>>>>> 12d7b4b8afb6e139a07e8cb62415ee57f2638be5
        (data) => {
          if (this.nav) this.back();
          this.changed.emit(data);
        }, (error) => {
          console.log(error);
          this.errorService.showAlert(error.verobose_message_header, error.verbose_message);
        },
      );
    } else {
<<<<<<< HEAD
      this.physicalPrint.updatePhysicalPrint(physicalPrint).subscribe(
=======
      this.physicalPrintService.createPhysicalPrint(physicalPrint).subscribe(
>>>>>>> 12d7b4b8afb6e139a07e8cb62415ee57f2638be5
        (data) => {
          if (this.nav) this.back();
          this.changed.emit(data);
        }, (error) => {
          console.log(error);
          this.errorService.showAlert(error.verobose_message_header, error.verbose_message);
        },
      );
    }
  }

  cancel() {
    if (this.nav) this.back();
    this.changed.emit(this.physicalPrint);
  }

  back() {
    this._location.back();
  }


}
