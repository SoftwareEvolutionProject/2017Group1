import { Injectable } from '@angular/core';
import {Headers, Http, Response, ResponseOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {DigitalPart} from '../../model/digital-part';
import {HttpClientService} from '../http/http-client.service';
import {HttpClient} from '../http/http.client';

@Injectable()
export class DigitalPartService {
  private endpoint: string = HttpClient.digitalPartUrl;

  constructor(private http: Http, private client: HttpClientService) {}

  getDigitalPart(id: number): Observable<DigitalPart> {
    console.log(id);
    console.log(this.client);
    console.log(this.endpoint + '/' + id);
    return this.client.get(this.endpoint + '/' + id)
      .map((data) => {
        console.log(data);
        return DigitalPart.create(data);
      });
  }

  getDigitalParts(): Observable<DigitalPart[]> {
    return this.client.get(this.endpoint)
      .map((data) => {
        const digitalParts: DigitalPart[] = [];
        for (let i = 0; i < data.length; i++) {
          digitalParts[i] = DigitalPart.create(data[i]);
        }
        return digitalParts;

      });
  }

  createDigitalPart(digitalPart: DigitalPart): Observable<DigitalPart> {
    return this.client.post(this.endpoint, digitalPart)
      .map((data) => {
          return data;
      });
  }
  updateDigitalPart(digitalPart: DigitalPart): Observable<DigitalPart> {
    return this.client.put(this.endpoint + '/' + digitalPart.id, JSON.stringify(digitalPart))
      .map((data) => {
        return data;
      });
  }

  deleteDigitalPart(id: number): Observable<boolean> {
    return this.client.delete(this.endpoint + '/' + id)
      .map((data) => {
        return true;
      });
  }
}
