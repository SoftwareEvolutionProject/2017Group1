import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Order} from '../../model/order';

@Injectable()
export class OrderMockService {
  public id: number;
  public customer: number;
  public date: string;
  private orders: Order[] = [
    new Order({
      id: 1,
      customer: 'Customer 1',
      date: '2017-11-22',
    }), new Order({
      id: 2,
      customer: 'Customer 2',
      date: '2017-11-23',
    }),
  ];

  constructor() {
  }

  getOrders(): Observable<Order[]> {
    return Observable.of(this.orders);
  }
  getDigialPart(id: number): Observable<Order> {
    return Observable.of( this.orders.filter((order) => {if (order.id == id) { return order; } })[0]);
  }
  delete(id: number) {
    this.orders = this.orders.filter((order) => {if (order.id != id) { return order; } });
    return Observable.of(true);
  }
}
