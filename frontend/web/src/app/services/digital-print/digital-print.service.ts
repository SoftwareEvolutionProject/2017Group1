import { Injectable } from '@angular/core';
import {Headers, Http, Response, ResponseOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {DigitalPrint} from '../../model/digital-print';
import {HttpClientService} from '../http/http-client.service';
import {HttpClient} from '../http/http.client';
import {MagicsFile} from "../../model/magics-file";

@Injectable()
export class DigitalPrintService {
  private endpoint: string = HttpClient.digitalPrintUrl;

  constructor(private http: Http, private client: HttpClientService) {}

  getDigitalPrint(id: number): Observable<DigitalPrint> {
    return this.client.get(this.endpoint + '/' + id)
      .map((data) => {
        return DigitalPrint.create(data);
      });
  }

  getAllDigitalPrint(): Observable<DigitalPrint[]> {
    return this.client.get(this.endpoint)
      .map((data) => {
        const customers: DigitalPrint[] = [];
        for (let i = 0; i < data.length; i++) {
          customers[i] = DigitalPrint.create(data[i]);
        }
        return customers;

      });
  }

  createDigitalPrint(digitalPrint: DigitalPrint): Observable<DigitalPrint> {
    return this.client.post(this.endpoint, digitalPrint)
      .map((data) => {
          return data;
      });
  }
  updateDigitalPrint(digitalPrint: DigitalPrint): Observable<DigitalPrint> {
    return this.client.put(this.endpoint + '/' + digitalPrint.id, JSON.stringify(digitalPrint))
      .map((data) => {
        return data;
      });
  }

  downloadMagicsFile(id: number): Observable<MagicsFile> {
    return this.client.get(this.endpoint + '/' + id);
  }

  deleteDigitalPrint(id: number): Observable<boolean> {
    return this.client.delete(this.endpoint + '/' + id)
      .map((data) => {
        return true;
      });
  }
}
