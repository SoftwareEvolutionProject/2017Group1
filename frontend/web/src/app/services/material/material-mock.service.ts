import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Material} from '../../model/material';
import {MaterialGrade} from '../../model/material-grade';

@Injectable()
export class MaterialMockService {

  public id: number;
  public customer: number;
  public date: string;
  private materials: Material[] = [
    new Material({
      id: 1,
      name: 'Stenhårt malm',
      supplierName: 'JimmyBs stenhårda gäng',
      initialAmount: 100,
      materialGrades: [
        new MaterialGrade({
          id: 1,
          materialID: 1,
          reusedTimes: 1,
          amount: 10,
        }),
        new MaterialGrade({
          id: 2,
          materialID: 1,
          reusedTimes: 2,
          amount: 10,
        }),
        new MaterialGrade({
          id: 3,
          materialID: 1,
          reusedTimes: 3,
          amount: 5,
        }),
      ],
      materialProperties: {
        Densitet: 'Black Hole',
        Färg: 'Regnbågen',
        Kommentar: 'För hårt för ditt eget bästa',
        Hårdhet: 'Stenhårt',
      },
    }];

  constructor() {
  }

  getMaterials(): Observable<Material[]> {
    return Observable.of(this.materials);
  }
  getDigialPart(id: number): Observable<Material> {
    return Observable.of( this.materials.filter((material) => {if (material.id == id) { return material; } })[0]);
  }
  delete(id: number) {
    this.materials = this.materials.filter((material) => {if (material.id != id) { return material; } });
    return Observable.of(true);
  }
}
