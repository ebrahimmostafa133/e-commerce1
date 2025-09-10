import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);

  getAllProducts(page:number = 1) {
    return this.httpClient.get(environment.baseUrl + `products?page=${page}`);
  }
}
