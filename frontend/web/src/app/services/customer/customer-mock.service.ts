import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Customer} from "../../model/customer";

@Injectable()
export class CustomerMockService {

  private customers: Customer[] = [
    new Customer({
      "id": 1,
      "name": "HiQ",
    }), new Customer({
      "id": 2,
      "name": "John Doe",
    })
  ];

  constructor() {
  }

  getCustomers(): Observable<Customer[]> {
    return Observable.of(this.customers)
  }

  delete(id: number) {
    this.customers = this.customers.filter(customer => {if(customer.id != id)return customer});
    return Observable.of(true);
  }

  getUser(id: number) {
    return Observable.of( this.customers.filter(customer => {if(customer.id == id)return customer})[0]);
  }

  edit(customer: Customer) {
    this.customers.forEach(c => {
      if(c.id == customer.id){
        c = customer;
      }
    });
    return Observable.of(true);
  }

  add(customer: Customer) {
    customer.id = Math.max.apply(Math, this.customers.map(customer => {
      return customer.id
    }));

    this.customers.push(customer);
    return Observable.of(true);
  }
}
