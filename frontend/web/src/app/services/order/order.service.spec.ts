import { inject, TestBed } from '@angular/core/testing';
import {Http} from '@angular/http';
import {BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {MockConnection} from '@angular/http/testing';
import {Order} from '../../model/order';
import {HttpClientService} from '../http/http-client.service';
import {OrderService} from './order.service';

describe('OrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        HttpClientService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ],
    });
  });

  it('should be created', inject([OrderService], (service: OrderService) => {
    expect(service).toBeTruthy();
  }));
  let userService: OrderService = null;
  let backend: MockBackend = null;

  beforeEach(inject([OrderService, MockBackend], (userServiceMock: OrderService, mockBackend: MockBackend) => {
    userService = userServiceMock;
    backend = mockBackend;
  }));

  const mockResponseArrayOrders = [
    {
      id: 1,
      name: 'test',
    }, {
      id: 2,
      name: 'test2',
    }, {
      id: 3,
      name: 'test3',
    },
  ];

  const expectedResponseArrayOrders: Order [] = [];
  mockResponseArrayOrders.forEach((item, index) => {
    expectedResponseArrayOrders.push(new Order(item));
  });

  describe('getAllOrder()', () => {

    it('should return an array of orders', (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockResponseArrayOrders),
        });
        connection.mockRespond(new Response(options));
      });

      userService.getOrders().subscribe((data) => {
        expect(data).toEqual(expectedResponseArrayOrders);
        done();
      });

    });
  });
});
