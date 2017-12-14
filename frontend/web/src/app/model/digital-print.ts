export class DigitalPrint {
  public id: number;
  public name: string;
  public path: string;
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
