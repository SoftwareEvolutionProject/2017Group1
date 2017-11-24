import { Injectable } from '@angular/core';
import {Headers, Http, Response, ResponseOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {HttpClientService} from '../http/http-client.service';
import {HttpClient} from '../http/http.client';
import {PhysicalPrint} from "../../model/physical-print";

@Injectable()
export class PhysicalPrintService {
  private endpoint: string = HttpClient.physicalPrintUrl;

  constructor(private http: Http, private client: HttpClientService) {}

  getPhysicalPrint(id: number): Observable<PhysicalPrint> {
    return this.client.get(this.endpoint + '/' + id)
      .map((data) => {
        return PhysicalPrint.create(data);
      });
  }

  getAllPhysicalPrint(): Observable<PhysicalPrint[]> {
    return this.client.get(this.endpoint)
      .map((data) => {
        const customers: PhysicalPrint[] = [];
        for (let i = 0; i < data.length; i++) {
          customers[i] = PhysicalPrint.create(data[i]);
        }
        return customers;

      });
  }

  createPhysicalPrint(physicalPrint: PhysicalPrint): Observable<PhysicalPrint> {
    return this.client.post(this.endpoint, physicalPrint)
      .map((data) => {
          return data;
      });
  }

  uploadSlmFile(physicalPrint: PhysicalPrint, slmFile: any): Observable<string> {
    return this.client.post(this.endpoint + '/' + physicalPrint.id + '/slm', slmFile)
      .map((data) => {
        return data;
      });
  }

  updatePhysicalPrint(physicalPrint: PhysicalPrint): Observable<PhysicalPrint> {
    return this.client.put(this.endpoint + '/' + physicalPrint.id, JSON.stringify(physicalPrint))
      .map((data) => {
        return data;
      });
  }

  deletePhysicalPrint(id: number): Observable<boolean> {
    return this.client.delete(this.endpoint + '/' + id)
      .map((data) => {
        return true;
      });
  }
}
