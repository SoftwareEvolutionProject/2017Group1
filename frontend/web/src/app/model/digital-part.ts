export class DigitalPart {
  public id: number;
  public name: string;
  public stlFile: string;
  public customerID: number;

  constructor(values: Object = {}) {
    console.log(values);
    if (!values) {
      return null;
    }
    Object.assign(this, values);
  }

  static create(json: any) {
    console.log(json);
    if (json) {
      return new DigitalPart(json);
    } else {
      return null;
    }
  }
}
