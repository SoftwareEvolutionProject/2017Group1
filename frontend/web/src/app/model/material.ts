import {MaterialGrade} from './material-grade';

export class Material {

  public id: number;
  public name: string;
  public supplierName: string;
  public initialAmmount: number;
  public materialGrades: MaterialGrade[];
  public materialProperties: any;

  constructor(values: Object = {}) {
    if (!values) {
      return null;
    }
    Object.assign(this, values);
  }

  static create(json: any) {
    if (json) {
      return new Material(json);
    } else {
      return null;
    }
  }
}
