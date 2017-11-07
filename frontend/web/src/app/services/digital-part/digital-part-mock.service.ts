import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DigitalPart} from '../../model/digital-part';

@Injectable()
export class DigitalPartMockService {

  private digtialParts: DigitalPart[] = [
    new DigitalPart({
      id: 1,
      name: 'Cool part',
      stlFile: 'cool-part.stl',
    }), new DigitalPart({
      id: 2,
      name: 'Best part',
      stlFile: 'best-part.stl',
    }),
  ];

  constructor() {
  }

  getDigitalParts(): Observable<DigitalPart[]> {
    return Observable.of(this.digtialParts);
  }
  getDigialPart(id: number): Observable<DigitalPart> {
    return Observable.of( this.digtialParts.filter((digitalPart) => {if (digitalPart.id == id) { return digitalPart; } })[0]);
  }
  delete(id: number) {
    this.digtialParts = this.digtialParts.filter((customer) => {if (customer.id != id) { return customer; } });
    return Observable.of(true);
  }
}
