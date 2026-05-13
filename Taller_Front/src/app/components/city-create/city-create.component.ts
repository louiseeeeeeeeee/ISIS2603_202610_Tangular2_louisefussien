import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Country } from '../../models/country.model';
import { CountryService } from '../../services/country.service';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-city-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './city-create.component.html'
})
export class CityCreateComponent implements OnInit {
  private countryService = inject(CountryService);
  private cityService = inject(CityService);

  @Output() cityCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  countries: Country[] = [];
  cityName = '';
  selectedCountryId: number | null = null;

  ngOnInit(): void {
    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  isInvalid(): boolean {
    return !this.cityName.trim() || this.selectedCountryId === null;
  }

  save(): void {
    if (this.isInvalid() || this.selectedCountryId === null) {
      return;
    }
    this.cityService
      .createCity(this.selectedCountryId, { name: this.cityName.trim() })
      .subscribe(() => this.cityCreated.emit());
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
