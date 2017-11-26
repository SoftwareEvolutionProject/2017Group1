import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Order} from '../../model/order';

@Injectable()
export class OrderMockService {

  public id: number;
  public customer: number;
  public date: string;

  private data: Order[] = [
    new Order({
      id: 1,
      order : 1,
      name: 'Cool order',
    }), new Order({
      id: 2,
      order : 1,
      name: 'Best order',
    }),
  ];

  constructor() {
  }

  getAll(): Observable<Order[]> {
    return Observable.of(this.data);
  }
  get(id: number): Observable<Order> {
    return Observable.of( this.data.filter((e) => {if (e.id === id) { return e; } })[0]);
  }
  delete(id: number) {
    this.data = this.data.filter((e) => {if (e.id !== id) { return e; } });
    return Observable.of(true);
  }
}
