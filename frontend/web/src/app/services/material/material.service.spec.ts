import { inject, TestBed } from '@angular/core/testing';
import {Http} from '@angular/http';
import {BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {MockConnection} from '@angular/http/testing';
import {Material} from '../../model/material';
import {HttpClientService} from '../http/http-client.service';
import {MaterialService} from './material.service';

describe('MaterialService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MaterialService,
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

  it('should be created', inject([MaterialService], (service: MaterialService) => {
    expect(service).toBeTruthy();
  }));
  let userService: MaterialService = null;
  let backend: MockBackend = null;

  beforeEach(inject([MaterialService, MockBackend], (userServiceMock: MaterialService, mockBackend: MockBackend) => {
    userService = userServiceMock;
    backend = mockBackend;
  }));

  const mockResponseArrayMaterials = [
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

  const expectedResponseArrayMaterials: Material [] = [];
  mockResponseArrayMaterials.forEach((item, index) => {
    expectedResponseArrayMaterials.push(new Material(item));
  });

  describe('getAllMaterial()', () => {

    it('should return an array of materials', (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockResponseArrayMaterials),
        });
        connection.mockRespond(new Response(options));
      });

      userService.getMaterials().subscribe((data) => {
        expect(data).toEqual(expectedResponseArrayMaterials);
        done();
      });

    });
  });
});
