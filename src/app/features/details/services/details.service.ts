import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  private readonly httpClient = inject(HttpClient);


  getProductDetails(id: string | null): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'products/' + `${id}`);
  }
}
