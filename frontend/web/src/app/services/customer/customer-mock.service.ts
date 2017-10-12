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
}
