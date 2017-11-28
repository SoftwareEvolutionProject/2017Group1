import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PhysicalPrint} from '../../model/physical-print';

@Injectable()
export class PhysicalPrintMockService {

  private data: PhysicalPrint[] = [
    new PhysicalPrint({
      id: 1,
      name: 'Cool print',
    }), new PhysicalPrint({
      id: 2,
      name: 'Fantastic print',
    }),
  ];

  constructor() {
  }

  getAll(): Observable<PhysicalPrint[]> {
    return Observable.of(this.data);
  }
  get(id: number): Observable<PhysicalPrint> {
    return Observable.of( this.data.filter((e) => {if (e.id === id) { return e; } })[0]);
  }
  delete(id: number) {
    this.data = this.data.filter((e) => {if (e.id !== id) { return e; } });
    return Observable.of(true);
  }
}
