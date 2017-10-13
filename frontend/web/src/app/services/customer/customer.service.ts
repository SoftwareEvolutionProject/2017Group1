import { Injectable } from '@angular/core';
import {HttpClient} from "../http.client";
import {Observable} from "rxjs";
import {Headers, Response, Http, ResponseOptions} from "@angular/http";
import {Customer} from "../../model/customer";

@Injectable()
export class CustomerService {
  private endPoint = HttpClient.customerUrl;

  constructor(private http: Http) {}

  private getHeader(): Headers{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  getCustomer(id : number): Observable<Customer> {
    return this.http.get(this.endPoint + "/" + id, {headers: this.getHeader()})
      .map((res: Response) => {
        let json = res.json();
        return Customer.create(json);
      }).catch((error:any) => {
        error.verbose_message = "Unable to get customer";
        return Observable.throw(error);
      });
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get(this.endPoint, {headers: this.getHeader()})
      .map((res: Response) => {
        let json = res.json();
        let customers: Customer[] = [];
        for(let i = 0; i<json.length;i++) {
          customers[i] = Customer.create(json[i]);
        }
        return customers;

      }).catch((error:any) => {
        error.verbose_message = "Unable to get customers";
        return Observable.throw(error);
      });
  }

  createCustomer(customer : Customer): Observable<Customer> {
    return this.http.post(this.endPoint, customer, {headers: this.getHeader()})
      .map((res: Response) => {
        if (res.status == 200) {
          return res.json();
          } else {
          return null;
        }
      }).catch((error: any) => {
        error.verbose_message = "Unable to add customer: ", JSON.stringify(customer);
        return Observable.throw(error);
      })
  }
  updateCustomer(customer: Customer) : Observable<boolean> {
    return this.http.put(this.endPoint + "/" + customer.id, JSON.stringify(customer), {headers:this.getHeader()})
      .map((res:Response) => {
        return res.status == 200;
      }).catch((error:any) => {
        error.verbose_message = "Unable to update customer";
        return Observable.throw(error);
      });
  }

  deleteCustomer(id : number) : Observable<boolean> {
    return this.http.delete(this.endPoint + "/" + id,{headers: this.getHeader()})
      .map((res: Response) => {
        return res.status == 200;
      }).catch((error:any) => {
        if (error.status == 401) {
          return Observable.of(false)
        } else {
          error.verbose_message = "Unable to update customer";
          return Observable.throw(error);
        }
    });
  }
}
