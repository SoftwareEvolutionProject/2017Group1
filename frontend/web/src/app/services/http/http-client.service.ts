import { Injectable } from '@angular/core';
import {Headers, Http, Response, ResponseOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {Router} from "@angular/router";

@Injectable()
export class HttpClientService {
  private headers: Headers = null;

  constructor(private http: Http,  private router: Router) {
    this.generateHeaders();
  }

  private generateHeaders() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  get(url: string): Observable<any> {
    return this.http.get(url, {headers: this.headers})
      .map((res: Response) => {
        return res.json();
      }).catch((error: any) => {
        this.handleError(error);
        return Observable.throw(error);
      });
  }

  post(url: string, data): Observable<any> {
    return this.http.post(url, data, {headers: this.headers})
      .map((res: Response) => {
        return res.json();
      }).catch((error: any) => {
        this.handleError(error);
        return Observable.throw(error);
      });
  }

  put(url: string, data): Observable<any> {
    return this.http.put(url, data, {headers: this.headers})
      .map((res: Response) => {
        return res.json();
      }).catch((error: any) => {
        this.handleError(error);
        return Observable.throw(error);
      });
  }

  delete(url: string): Observable<any> {
    return this.http.delete(url, {headers: this.headers})
      .map((res: Response) => {
        return res.json();
      }).catch((error: any) => {
        this.handleError(error);
        return Observable.throw(error);
      });
  }



  private handleError(error) {
    console.log(error);
    if (error.status === 0) {
      error.verbose_message = 'Unable to get resource: connection cannot be established';
    } else if (error.status === 0) {
      error.verbose_message = 'Unable to get resource: connection cannot be established';
    } else if (error.status === 404) {
      error.verobose_message_header = 'Unable to get resource';
      error.verbose_message = 'The resource might not exist. ';
      this.router.navigate(['/404']);
    } else if (error.status === 500) {
      error.verobose_message_header = 'Internal Server Error';
      error.verbose_message = 'Something went wrong.';
    } else if (error.status === 401) {
      error.verobose_message_header = 'Not authorized';
      error.verbose_message = 'You moight not have access to the requested resource or your token has expired.';
      this.router.navigate(['/login']);
    }
  }
}

