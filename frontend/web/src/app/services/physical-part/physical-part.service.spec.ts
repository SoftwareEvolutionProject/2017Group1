import { inject, TestBed } from '@angular/core/testing';
import {Http} from '@angular/http';
import {BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {MockConnection} from '@angular/http/testing';
import {PhysicalPart} from '../../model/physical-part';
import {HttpClientService} from '../http/http-client.service';
import {PhysicalPartService} from './physical-part.service';

describe('PhysicalPrintService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PhysicalPartService,
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

  it('should be created', inject([PhysicalPartService], (service: PhysicalPartService) => {
    expect(service).toBeTruthy();
  }));
  let userService: PhysicalPartService = null;
  let backend: MockBackend = null;

  beforeEach(inject([PhysicalPartService, MockBackend], (userServiceMock: PhysicalPartService, mockBackend: MockBackend) => {
    userService = userServiceMock;
    backend = mockBackend;
  }));

  const mockResponseArrayPhysicalParts = [
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

  const expectedResponseArrayPhysicalParts: PhysicalPart [] = [];
  mockResponseArrayPhysicalParts.forEach((item, index) => {
    expectedResponseArrayPhysicalParts.push(new PhysicalPart(item));
  });

  describe('getAllPhysicalPrint()', () => {

    it('should return an array of physicalParts', (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockResponseArrayPhysicalParts),
        });
        connection.mockRespond(new Response(options));
      });

      userService.getPhysicalParts().subscribe((data) => {
        expect(data).toEqual(expectedResponseArrayPhysicalParts);
        done();
      });

    });
  });
});
