export class PhysicalPart {
  public id: number;
  public orderedPart: number;
  public physicalPrint: number;
  public magicID: number;
  public name: string;

  constructor(values: Object = {}) {
    if (!values) {
      return null;
    }
    Object.assign(this, values);
  }

  static create(json: any) {
    if (json) {
      return new PhysicalPart(json);
    } else {
      return null;
    }
  }
}
