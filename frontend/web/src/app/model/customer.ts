export class Customer {

  public id: number;
  public name: string;
  public eMail: string;

  constructor(values: Object = {}) {
    if (!values)
      return null;
    Object.assign(this, values);
  }

  static create(json: any) {
    if (json)
      return new Customer(json);
    else
      return null;
  }
}
