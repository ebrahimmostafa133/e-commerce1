import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Brand } from '../../../core/models/brand.interface';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}brands`;

  getAllBrands(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}`);
  }

  getSingleBrand(id: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/${id}`);
  }
}
