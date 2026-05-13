import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map WeatherAPI response to WeatherDetail', () => {
    let result: any = null;
    service.getWeather('Bogota').subscribe(r => (result = r));

    const req = httpMock.expectOne(r => r.url.includes('current.json') && r.url.includes('q=Bogota'));
    expect(req.request.method).toBe('GET');
    req.flush({
      location: { name: 'Bogota', country: 'Colombia' },
      current: { temp_c: 15, condition: { text: 'Partly cloudy' }, humidity: 82 }
    });

    expect(result).toEqual({ temp_c: 15, condition: 'Partly cloudy', humidity: 82 });
  });
});
