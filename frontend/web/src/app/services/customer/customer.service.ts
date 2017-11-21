import { Injectable } from '@angular/core';
import {Headers, Http, Response, ResponseOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {Customer} from '../../model/customer';
import {HttpClientService} from '../http/http-client.service';
import {HttpClient} from '../http/http.client';
import {DigitalPart} from "../../model/digital-part";

@Injectable()
export class CustomerService {
  private endpoint: string = HttpClient.customerUrl;

  constructor(private http: Http, private client: HttpClientService) {}

  getCustomer(id: number): Observable<Customer> {
    return this.client.get(this.endpoint + '/' + id)
      .map((data) => {
        return Customer.create(data);
      });
  }

  getCustomers(): Observable<Customer[]> {
    return this.client.get(this.endpoint)
      .map((data) => {
        const customers: Customer[] = [];
        for (let i = 0; i < data.length; i++) {
          customers[i] = Customer.create(data[i]);
        }
        return customers;

      });
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.client.post(this.endpoint, customer)
      .map((data) => {
          return data;
      });
  }
  updateCustomer(customer: Customer): Observable<Customer> {
    return this.client.put(this.endpoint + '/' + customer.id, JSON.stringify(customer))
      .map((data) => {
        return data;
      });
  }

  getDigitalParts(id: number): Observable<DigitalPart[]> {
    return this.client.get(this.endpoint + '/' + id + '/digital-parts')
        .map((data) => {
            const digitalParts: DigitalPart[] = [];
            for (let i = 0; i < data.length; i++) {
              digitalParts[i] = DigitalPart.create(data[i]);
            }
            return digitalParts;
          });
  }

  deleteCustomer(id: number): Observable<boolean> {
    return this.client.delete(this.endpoint + '/' + id)
      .map((data) => {
        return true;
      });
  }
}
