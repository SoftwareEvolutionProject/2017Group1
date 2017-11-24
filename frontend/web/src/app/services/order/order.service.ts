
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClientService} from '../http/http-client.service';
import {HttpClient} from '../http/http.client';
import {Order} from "../../model/order";

@Injectable()
export class OrderService {
  private endpoint: string = HttpClient.orderUrl;

  constructor(private client: HttpClientService) {}

  getOrder(id: number): Observable<Order> {
    return this.client.get(this.endpoint + '/' + id)
      .map((data) => {
        return Order.create(data);
      });
  }

  getOrders(): Observable<Order[]> {
    return this.client.get(this.endpoint)
      .map((data) => {
        const orders: Order[] = [];
        for (let i = 0; i < data.length; i++) {
          orders[i] = Order.create(data[i]);
        }
        return orders;
      });
  }

  createOrder(order: Order): Observable<Order> {
    return this.client.post(this.endpoint, order)
      .map((data) => {
          return data;
      });
  }

  updateOrder(order: Order): Observable<Order> {
    return this.client.put(this.endpoint + '/' + order.id, JSON.stringify(order))
      .map((data) => {
        return data;
      });
  }

  deleteOrder(id: number): Observable<boolean> {
    return this.client.delete(this.endpoint + '/' + id)
      .map((data) => {
        return true;
      });
  }
}