import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../../models/city.model';
import { WeatherRecord } from '../../models/weather-record.model';
import { WeatherDetail } from '../../models/weather.model';
import { WeatherRecordService } from '../../services/weather-record.service';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-detail.component.html'
})
export class CityDetailComponent implements OnChanges {
  private weatherRecordService = inject(WeatherRecordService);
  private weatherService = inject(WeatherService);

  @Input() city!: City;

  weatherDetail: WeatherDetail | null = null;
  loading = false;
  weatherRecords: WeatherRecord[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['city'] && this.city) {
      this.loadRecords();
      this.loadWeather();
    }
  }

  private loadRecords(): void {
    this.weatherRecordService.getRecords(this.city.id)
      .subscribe(records => this.weatherRecords = records);
  }

  private loadWeather(): void {
    this.weatherDetail = null;
    this.loading = true;
    this.weatherService.getWeather(this.city.name).subscribe({
      next: detail => {
        this.weatherDetail = detail;
        this.loading = false;
      },
      error: () => {
        this.weatherDetail = null;
        this.loading = false;
      }
    });
  }

  saveWeather(): void {
    if (!this.weatherDetail) {
      return;
    }
    const payload = {
      tempC: this.weatherDetail.temp_c,
      condition: this.weatherDetail.condition,
      humidity: this.weatherDetail.humidity
    };
    this.weatherRecordService.saveRecord(this.city.id, payload).subscribe(() => {
      this.loadRecords();
    });
  }
}
