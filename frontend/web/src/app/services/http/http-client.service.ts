import { Injectable } from '@angular/core';
import {Headers, Http, Response, ResponseOptions} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()
export class HttpClientService {
  private headers: Headers = null;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  get(url: string): Observable<any> {
    return this.http.get(url, {headers: this.headers})
      .map((res: Response) => {
        return res.json();
      }).catch((error: any) => {
        if (error.status == 0){
          error.verbose_message = 'Unable to get resource: connection cannot be established';
        } else {
          error.verbose_message = 'Unable to get resource: unknown error';
        }
        return Observable.throw(error);
      });
  }

  post(url: string, data): Observable<any> {
    return this.http.post(url, data, {headers: this.headers})
      .map((res: Response) => {
        return res.json();
      }).catch((error: any) => {
        if (error.status == 0){
          error.verbose_message = 'Unable to create resource: connection cannot be established';
        } else {
          error.verbose_message = 'Unable to create resource: unknown error';
        }
        return Observable.throw(error);
      });
  }

  put(url: string, data): Observable<any> {
    return this.http.put(url, data, {headers: this.headers})
      .map((res: Response) => {
        return res.json();
      }).catch((error: any) => {
        if (error.status == 0){
          error.verbose_message = 'Unable to update resource: connection cannot be established';
        } else {
          error.verbose_message = 'Unable to update resource: unknown error';
        }
        return Observable.throw(error);
      });
  }

  delete(url: string): Observable<any> {
    return this.http.delete(url, {headers: this.headers})
      .map((res: Response) => {
        return res.json();
      }).catch((error: any) => {
        if (error.status == 0){
          error.verbose_message = 'Unable to delete resource: connection cannot be established';
        } else {
          error.verbose_message = 'Unable to delete resource: unknown error';
        }
        return Observable.throw(error);
      });
  }
}
