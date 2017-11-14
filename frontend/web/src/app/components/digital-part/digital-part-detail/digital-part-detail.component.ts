import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DigitalPart } from '../../../model/digital-part';
import { DigitalPartMockService } from '../../../services/digital-part/digital-part-mock.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-digital-part-detail',
  templateUrl: './digital-part-detail.component.html',
  styleUrls: ['./digital-part-detail.component.scss'],
  providers: [DigitalPartMockService, ErrorService],
})
export class DigitalPartDetailComponent implements OnInit {
  private loaded = false;
  private creating = false;

  /* forms */
  private requiredFieldsForm: FormGroup = null;

  /* data */
  private digitalPart: DigitalPart = null;

  constructor(
    private route: ActivatedRoute,
    private digitalPartMockService: DigitalPartMockService,
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private _location: Location) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (!id || id === 'create') { // new product is being created
        this.creating = true;
        /* init with a boilerplate */
        if (this.creating) { this.digitalPart = new DigitalPart({}); }
        this.populate();
      } else if (id) {
        this.getData(id);
      }
    });
  }

  ngAfterViewInit() {
  }

  /* get the product */
  getData(id) {
    this.digitalPartMockService.getDigialPart(id).subscribe(
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
    const fields = {
      name: [this.digitalPart && this.digitalPart.name ? this.digitalPart.name : '',
      Validators.compose([Validators.required])],
      id: [{ value: (this.digitalPart && this.digitalPart.id ? this.digitalPart.id : ''), disabled: true },
      Validators.compose([Validators.required])],
      stlFile: [this.digitalPart && this.digitalPart.stlFile ? this.digitalPart.stlFile : '',
      Validators.compose([Validators.required])],
    };

    this.requiredFieldsForm = this.formBuilder.group(fields);
    console.log(!this.requiredFieldsForm.get('id').valid);
    this.loaded = true;
  }

  back() {
    this._location.back();
  }

}
