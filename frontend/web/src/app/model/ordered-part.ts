export class OrderedPart {
  public id: number;
  public amount: number;
  public digitalPartID: number;
  public order: number;

  constructor(values: Object = {}) {
    if (!values) {
      return null;
    }
    Object.assign(this, values);
  }

  static create(json: any) {
    if (json) {
      return new OrderedPart(json);
    } else {
      return null;
    }
  }
}
