import {Location} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {DigitalPrint} from '../../../model/digital-print';
import {ErrorService} from '../../../services/error.service';
import {DigitalPrintService} from '../../../services/digital-print/digital-print.service';

@Component({
  selector: 'app-digital-print-edit',
  providers: [DigitalPrintService, ErrorService],
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

  constructor(private route: ActivatedRoute,
              private digitalPrintService: DigitalPrintService,
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
    if (this.creating) {
      this.digitalPrint = new DigitalPrint({});
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

  /* populate data */
  private populate() {
    this.constructForms();
  }

  /* init forms */
  private constructForms() {
    const fields = {
      magicspath: [this.digitalPrint && this.digitalPrint.magicsPath ? this.digitalPrint.magicsPath : '',
        Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    this.loaded = true;
  }

  /* save product instance */
  save() {
    /* convert relevant fields */

    const id = this.digitalPrint.id;
    const digitalPrint: DigitalPrint = new DigitalPrint(this.requiredFieldsForm.value);
    this.creating ? delete digitalPrint['id'] : digitalPrint.id = id;

    console.log(digitalPrint);

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
