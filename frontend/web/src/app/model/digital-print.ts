export class DigitalPrint {
  public id: number;
  public path: string;
  public name: string;
  public magicsPartPairing: any;

  constructor(values) {
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
