import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {DigitalPart} from "../../model/digital-part";

@Injectable()
export class DigitalPartMockService {

  private digtialParts: DigitalPart[] = [
    new DigitalPart({
      "id": 1,
      "name": "Cool part",
    }), new DigitalPart({
      "id": 2,
      "name": "Best part",
    })
  ];

  constructor() {
  }

  getDigitalParts(): Observable<DigitalPart[]> {
    return Observable.of(this.digtialParts)
  }

  delete(id: number) {
    this.digtialParts = this.digtialParts.filter(customer => {if(customer.id != id)return customer});
    return Observable.of(true);
  }
}
