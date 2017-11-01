import { Injectable } from '@angular/core';
import {HttpClient} from "../http/http.client";
import {Observable} from "rxjs";
import {Headers, Response, Http, ResponseOptions} from "@angular/http";
import {Customer} from "../../model/customer";
import {HttpClientService} from "../http/http-client.service";

@Injectable()
export class CustomerService {
  private endpoint:string = HttpClient.customerUrl;

  constructor(private http: Http, private client: HttpClientService) {}

  getCustomer(id : number): Observable<Customer> {
    return this.client.get(this.endpoint + "/" + id)
      .map((data) => {
        return Customer.create(data);
      })
  }

  getCustomers(): Observable<Customer[]> {
    return this.client.get(this.endpoint)
      .map((data) => {
        let customers: Customer[] = [];
        for(let i = 0; i<data.length;i++) {
          customers[i] = Customer.create(data[i]);
        }
        return customers;

      })
  }

  createCustomer(customer : Customer): Observable<Customer> {
    return this.client.post(this.endpoint, customer)
      .map((data) => {
          return data;
      })
  }
  updateCustomer(customer: Customer) : Observable<boolean> {
    return this.client.put(this.endpoint + "/" + customer.id, JSON.stringify(customer))
      .map((data) => {
        return true;
      })
  }

  deleteCustomer(id : number) : Observable<boolean> {
    return this.client.delete(this.endpoint + "/" + id)
      .map((data) => {
        return true;
      })
  }
}
