import { Headers, Http, Response, ResponseOptions } from '@angular/http';
import { HttpClient } from '../http/http.client';
import { HttpClientService } from '../http/http-client.service';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Material } from '../../model/material';

@Injectable()
export class MaterialService {
  private endpoint: string = HttpClient.materialUrl;

  constructor(private http: Http, private client: HttpClientService) {}

  listMaterials(data) {
    const materials: Material[] = [];
    for (let i = 0; i < data.length; i++) {
      materials[i] = Material.create(data[i]);
    }
    return materials;

  }

  getMaterial(id: number): Observable<Material> {
    return this.client.get(`${this.endpoint}/${id}`)
      .map((data) => {
        return Material.create(data);
      });
  }

  getMaterialsByDigitalPartID(digitalPartID): Observable<Material[]> {
    return this.client.get(`${this.endpoint}?digitalPartID=${digitalPartID}`)
      .map(this.listMaterials);
  }

  getMaterials(): Observable<Material[]> {
    return this.client.get(this.endpoint)
      .map(this.listMaterials);
  }

  createMaterial(material: Material): Observable<Material> {
    return this.client.post(this.endpoint, material)
      .map((data) => {
          return data;
      });
  }
  updateMaterial(material: Material): Observable<Material> {
    return this.client.put(`${this.endpoint}/${material.id}`, JSON.stringify(material))
      .map((data) => {
        return data;
      });
  }

  deleteMaterial(id: number): Observable<boolean> {
    return this.client.delete(`${this.endpoint}/${id}`)
      .map((data) => {
        return true;
      });
  }
}
