import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { WeatherRecordService } from './weather-record.service';

describe('WeatherRecordService', () => {
  let service: WeatherRecordService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(WeatherRecordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET /cities/:id/weather-records', () => {
    service.getRecords(1).subscribe();
    const req = httpMock.expectOne(r => r.url.endsWith('/cities/1/weather-records'));
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should POST a weather record', () => {
    const payload = { tempC: 20, condition: 'Sunny', humidity: 50 };
    service.saveRecord(1, payload).subscribe();
    const req = httpMock.expectOne(r => r.url.endsWith('/cities/1/weather-records'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 10, ...payload, recordedAt: '2026-05-13T10:00:00' });
  });
});
