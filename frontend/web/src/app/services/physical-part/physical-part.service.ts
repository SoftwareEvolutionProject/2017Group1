import { Injectable } from '@angular/core';
import {Headers, Http, Response, ResponseOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {PhysicalPart} from '../../model/physical-part';
import {HttpClientService} from '../http/http-client.service';
import {HttpClient} from '../http/http.client';

@Injectable()
export class PhysicalPartService {
  private endpoint: string = HttpClient.physicalPartUrl;

  constructor(private http: Http, private client: HttpClientService) {}

  getPhysicalPart(id: number): Observable<PhysicalPart> {
    return this.client.get(this.endpoint + '/' + id)
      .map((data) => {
        return PhysicalPart.create(data);
      });
  }

  getPhysicalParts(): Observable<PhysicalPart[]> {
    return this.client.get(this.endpoint)
      .map((data) => {
        const physicalParts: PhysicalPart[] = [];
        for (let i = 0; i < data.length; i++) {
          physicalParts[i] = PhysicalPart.create(data[i]);
        }
        return physicalParts;

      });
  }

  createPhysicalPart(physicalPart: PhysicalPart): Observable<PhysicalPart> {
    return this.client.post(this.endpoint, physicalPart)
      .map((data) => {
          return data;
      });
  }
  updatePhysicalPart(physicalPart: PhysicalPart): Observable<PhysicalPart> {
    return this.client.put(this.endpoint + '/' + physicalPart.id, JSON.stringify(physicalPart))
      .map((data) => {
        return data;
      });
  }

  deletePhysicalPart(id: number): Observable<boolean> {
    return this.client.delete(this.endpoint + '/' + id)
      .map((data) => {
        return true;
      });
  }
}
