export class DigitalPrint {
  public id: number;
  public magicsPath: string;
  public magicsPartPairing: object;

  constructor(values: Object = {}) {
    if (!values) {
      return null;
    }
    Object.assign(this, values);
  }

  static create(json: any) {
    if (json) {
      return new DigitalPrint(json);
    } else {
      return null;
    }
  }
}
