import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DigitalPrint} from "../../model/digital-print";

@Injectable()
export class DigitalPrintMockService {

  private data: DigitalPrint[] = [
    new DigitalPrint({
      id: 1,
    }), new DigitalPrint({
      id: 2,
    }),
  ];

  constructor() {
  }

  getAll(): Observable<DigitalPrint[]> {
    return Observable.of(this.data);
  }
  get(id: number): Observable<DigitalPrint> {
    return Observable.of( this.data.filter((e) => {if (e.id === id) { return e; } })[0]);
  }
  delete(id: number) {
    this.data = this.data.filter((e) => {if (e.id !== id) { return e; } });
    return Observable.of(true);
  }
}
