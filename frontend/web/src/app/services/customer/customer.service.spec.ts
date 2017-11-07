import { inject, TestBed } from '@angular/core/testing';
import {Http} from '@angular/http';
import {BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {MockConnection} from '@angular/http/testing';
import {Customer} from '../../model/customer';
import {HttpClientService} from '../http/http-client.service';
import {CustomerService} from './customer.service';

describe('CustomerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomerService,
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

  it('should be created', inject([CustomerService], (service: CustomerService) => {
    expect(service).toBeTruthy();
  }));
  let userService: CustomerService = null;
  let backend: MockBackend = null;

  beforeEach(inject([CustomerService, MockBackend], (userServiceMock: CustomerService, mockBackend: MockBackend) => {
    userService = userServiceMock;
    backend = mockBackend;
  }));

  const mockResponseArrayCustomers = [
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

  const expectedResponseArrayCustomers: Customer [] = [];
  mockResponseArrayCustomers.forEach((item, index) => {
    expectedResponseArrayCustomers.push(new Customer(item));
  });

  describe('getCustomers()', () => {

    it('should return an array of customers', (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockResponseArrayCustomers),
        });
        connection.mockRespond(new Response(options));
      });

      userService.getCustomers().subscribe((data) => {
        expect(data).toEqual(expectedResponseArrayCustomers);
        done();
      });

    });
  });
});
