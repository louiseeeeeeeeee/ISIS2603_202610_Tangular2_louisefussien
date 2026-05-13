import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CityService } from './city.service';

describe('CityService', () => {
  let service: CityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET /cities', () => {
    service.getCities().subscribe();
    const req = httpMock.expectOne(r => r.url.endsWith('/cities'));
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should POST to /countries/:id/cities when creating', () => {
    service.createCity(2, { name: 'Madrid' }).subscribe();
    const req = httpMock.expectOne(r => r.url.endsWith('/countries/2/cities'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Madrid' });
    req.flush({ id: 99, name: 'Madrid', country: { id: 2, name: 'Spain', isoCode: 'ES' } });
  });
});
