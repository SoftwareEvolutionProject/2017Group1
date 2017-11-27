import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PhysicalPart} from '../../model/physical-part';

@Injectable()
export class PhysicalPartMockService {

  private data: PhysicalPart[] = [
    new PhysicalPart({
      id: 1,
      physicalPrintID: 1,
      magicsPartPairingID: 1,
      orderedPartID : 1,
    }), new PhysicalPart({
      id: 2,
      physicalPrintID: 2,
      magicsPartPairingID: 4,
      orderedPartID : 3,
    }),
  ];

  constructor() {
  }

  getPhysicalParts(): Observable<PhysicalPart[]> {
    return Observable.of(this.data);
  }

  getPhysicalPart(id: number): Observable<PhysicalPart> {
    return Observable.of( this.data.filter((e) => {if (e.id === id) { return e; } })[0]);
  }

  delete(id: number) {
    this.data = this.data.filter((e) => {if (e.id !== id) { return e; } });
    return Observable.of(true);
  }
}
