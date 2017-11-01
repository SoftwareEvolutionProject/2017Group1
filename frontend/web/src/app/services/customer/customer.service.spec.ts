import { TestBed, inject } from '@angular/core/testing';
import {CustomerService} from "./customer.service";
import {MockBackend} from "@angular/http/testing";
import {MockConnection} from "@angular/http/testing";
import {Http} from "@angular/http";
import {BaseRequestOptions, Response, ResponseOptions} from "@angular/http";
import {Customer} from "../../model/customer";

describe('CustomerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomerService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ]
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


  let mockResponseArrayCustomers = [
    {
      id: 1,
      name: "test"
    }, {
      id: 2,
      name: "test2"
    }, {
      id: 3,
      name: "test3"
    },
  ];

  let expectedResponseArrayCustomers: Customer [] = [];
  mockResponseArrayCustomers.forEach((item, index) => {
    expectedResponseArrayCustomers.push(new Customer(item))
  });

  describe('getCustomers()', () => {

    it('should return an array of customers', (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        let options = new ResponseOptions({
          body: JSON.stringify(mockResponseArrayCustomers)
        });
        connection.mockRespond(new Response(options));
      });

      userService.getCustomers().subscribe(data => {
        expect(data).toEqual(expectedResponseArrayCustomers);
        done();
      });

    });
  });
});
