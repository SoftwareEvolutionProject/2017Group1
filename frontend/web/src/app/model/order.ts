import {OrderedPart} from './ordered-part';

export class Order {

  public id: number;
  public customerID: number;
  public date: string;
  public orderedParts: OrderedPart[];

  constructor(values: Object = {}) {
    if (!values) {
      return null;
    }
    Object.assign(this, values);
  }

  static create(json: any) {
    if (json) {
      return new Order(json);
    } else {
      return null;
    }
  }
}
