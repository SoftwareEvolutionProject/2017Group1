export class MagicsFile {
  public id: number;
  public digitalPrintID: number;
  public name: string;
  public magicsFile: any;

  constructor(values) {
    if (!values) {
      return null;
    }
    Object.assign(this, values);
  }

  static create(json: any) {
    if (json) {
      return new MagicsFile(json);
    } else {
      return null;
    }
  }
}
