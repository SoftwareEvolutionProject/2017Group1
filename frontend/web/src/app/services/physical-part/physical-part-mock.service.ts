import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PhysicalPart} from '../../model/physical-part';

@Injectable()
export class PhysicalPartMockService {

  private data: PhysicalPart[] = [
    new PhysicalPart({
      id: 1,
      orderedPart : 1,
      physicalPrint : 1,
      name: 'Cool printed part',
    }), new PhysicalPart({
      id: 2,
      orderedPart : 1,
      physicalPrint : 1,
      name: 'Best printed part',
    }),
  ];

  constructor() {
  }

  getAll(): Observable<PhysicalPart[]> {
    return Observable.of(this.data);
  }
  get(id: number): Observable<PhysicalPart> {
    return Observable.of( this.data.filter((e) => {if (e.id === id) { return e; } })[0]);
  }
  delete(id: number) {
    this.data = this.data.filter((e) => {if (e.id !== id) { return e; } });
    return Observable.of(true);
  }
}
