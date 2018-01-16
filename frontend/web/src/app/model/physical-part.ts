import {PhysicalPrint} from "./physical-print";

export class PhysicalPart {
  public id: number;
  public orderedPartID: number;
  public physicalPrintID: number;
  public magicsPartPairingLabel: string;

  constructor(values: Object = {}) {
    if (!values) {
      return null;
    }
    Object.assign(this, values);
  }

  static create(json: any) {
    if (json) {
      return new PhysicalPart(json);
    } else {
      return null;
    }
  }

  static createFromPhysicalPrint(pPrint: PhysicalPrint): PhysicalPart {
    const pp = new PhysicalPart();
    pp.physicalPrintID = pPrint.id;
    return pp;
  }
}
