import { inject, TestBed } from '@angular/core/testing';
import {Http} from '@angular/http';
import {BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {MockConnection} from '@angular/http/testing';
import {Customer} from '../../model/customer';
import {HttpClientService} from '../http/http-client.service';
import {PhysicalPrintService} from './physical-print.service';
import {PhysicalPrint} from "../../model/physical-print";

describe('PhysicalPrintService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PhysicalPrintService,
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

  it('should be created', inject([PhysicalPrintService], (service: PhysicalPrintService) => {
    expect(service).toBeTruthy();
  }));
  let physicalPartService: PhysicalPrintService = null;
  let backend: MockBackend = null;

  beforeEach(inject([PhysicalPrintService, MockBackend], (physicalPartServiceMock: PhysicalPrintService, mockBackend: MockBackend) => {
    physicalPartService = physicalPartServiceMock;
    backend = mockBackend;
  }));

  const mockResponseArray = [
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

  const expectedResponseArray: PhysicalPrint [] = [];
  mockResponseArray.forEach((item, index) => {
    expectedResponseArray.push(new PhysicalPrint(item));
  });

  describe('getAllPhysicalPrint()', () => {

    it('should return an array of customers', (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockResponseArray),
        });
        connection.mockRespond(new Response(options));
      });

      physicalPartService.getAllPhysicalPrint().subscribe((data) => {
        expect(data).toEqual(expectedResponseArray);
        done();
      });

    });
  });
});
