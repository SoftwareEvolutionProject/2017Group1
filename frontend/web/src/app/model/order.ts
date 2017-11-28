export class Order {

  public id: number;
  public customer: number;
  public date: string;

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
