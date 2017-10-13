export class DigitalPart {
  public id: number;
  public name: string;

  constructor(values: Object = {}) {
    if (!values) return null;
    Object.assign(this, values);
  }

  static createDigitalPart(json: any) {
    if (json) return new DigitalPart(json);
    else return null;
  }
}
