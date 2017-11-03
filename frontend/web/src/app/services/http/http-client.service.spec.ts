import { inject, TestBed } from '@angular/core/testing';

import {BaseRequestOptions, Http, Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import { HttpClientService } from './http-client.service';
import {HttpClient} from './http.client';

describe('HttpClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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

  it('should be created', inject([HttpClientService], (service: HttpClientService) => {
    expect(service).toBeTruthy();
  }));
  let httpClientService: HttpClientService = null;
  let backend: MockBackend = null;

  beforeEach(inject([HttpClientService, MockBackend], (httpClientServiceMock: HttpClientService, mockBackend: MockBackend) => {
    httpClientService = httpClientServiceMock;
    backend = mockBackend;
  }));

  const mockResponseArrayCustomers = JSON.stringify( [
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
  ]);

  const expectedResponseArrayCustomers = JSON.stringify( [
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
  ]);

  describe('get()', () => {

    it('should return an array of customers', (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockResponseArrayCustomers),
        });
        connection.mockRespond(new Response(options));
      });

      httpClientService.get(HttpClient.customerUrl).subscribe((data) => {
        expect(data).toEqual(expectedResponseArrayCustomers);
        done();
      });

    });
  });
});
