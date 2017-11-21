export class PhysicalPrint {
  public id: number;
  public digitalPrintID: number;
  public slmPath: string;

  constructor(values: Object = {}) {
    if (!values) {
      return null;
    }
    Object.assign(this, values);
  }

  static create(json: any) {
    if (json) {
      return new PhysicalPrint(json);
    } else {
      return null;
    }
  }
}
