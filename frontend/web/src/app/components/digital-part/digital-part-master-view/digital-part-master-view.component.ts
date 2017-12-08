import { Component, OnInit } from '@angular/core';
import {Customer} from '../../../model/customer';
import {DigitalPart} from '../../../model/digital-part';
import {CustomerService} from '../../../services/customer/customer.service';

@Component({
  selector: 'app-digital-part-master-view',
  templateUrl: './digital-part-master-view.component.html',
  styleUrls: ['./digital-part-master-view.component.scss'],
  providers: [CustomerService],
})
export class DigitalPartMasterViewComponent implements OnInit {

  selectedDigitalPart: DigitalPart = null;
  selectedCustomer: Customer = null;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
  }

  public digitalPartSelected(event) {
    this.selectedDigitalPart = event;
    this.getCustomer(this.selectedDigitalPart.customerID);
  }
  getCustomer(id: number) {
    this.customerService.getCustomer(id).subscribe(
      (customer) => {
        this.selectedCustomer = customer;
      }, (error) => {
        console.log(error);
        alert(error.verbose_message);
      },
    );
  }
}
