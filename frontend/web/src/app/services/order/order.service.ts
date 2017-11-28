import { Headers, Http, Response, ResponseOptions } from '@angular/http';
import { HttpClient } from '../http/http.client';
import { HttpClientService } from '../http/http-client.service';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Order } from '../../model/order';

@Injectable()
export class OrderService {
  private endpoint: string = HttpClient.orderUrl;

  constructor(private http: Http, private client: HttpClientService) {}

  listOrders(data) {
    const orders: Order[] = [];
    for (let i = 0; i < data.length; i++) {
      orders[i] = Order.create(data[i]);
    }
    return orders;

  }

  getOrder(id: number): Observable<Order> {
    return this.client.get(`${this.endpoint}/${id}`)
      .map((data) => {
        return Order.create(data);
      });
  }

  getOrdersByDigitalPartID(digitalPartID): Observable<Order[]> {
    return this.client.get(`${this.endpoint}?digitalPartID=${digitalPartID}`)
      .map(this.listOrders);
  }

  getOrders(): Observable<Order[]> {
    return this.client.get(this.endpoint)
      .map(this.listOrders);
  }

  createOrder(order: Order): Observable<Order> {
    return this.client.post(this.endpoint, order)
      .map((data) => {
          return data;
      });
  }
  updateOrder(order: Order): Observable<Order> {
    return this.client.put(`${this.endpoint}/${order.id}`, JSON.stringify(order))
      .map((data) => {
        return data;
      });
  }

  deleteOrder(id: number): Observable<boolean> {
    return this.client.delete(`${this.endpoint}/${id}`)
      .map((data) => {
        return true;
      });
  }
}
