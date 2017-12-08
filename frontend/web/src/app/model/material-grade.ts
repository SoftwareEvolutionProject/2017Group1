export class MaterialGrade {

  public id: number;
  public materialID: number;
  public reusedTimes: number;
  public amount: number;

  constructor(values: Object = {}) {
    if (!values) {
      return null;
    }
    Object.assign(this, values);
  }

  static create(json: any) {
    if (json) {
      return new MaterialGrade(json);
    } else {
      return null;
    }
  }
}
