import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Orders } from '../../../core/models/orders.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly authService = inject(AuthService);

  private cartSubject = new BehaviorSubject<any>(null);
  cart$ = this.cartSubject.asObservable();

  

  addProductToCart(id: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'cart', {
      productId: id
    }).pipe(
      tap((res: any) => this.cartSubject.next(res.data))
    );
  }

  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'cart',).pipe(
      tap((res: any) => this.cartSubject.next(res.data)) 
    );
  }

  removeSpecificProductFromCart(id: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'cart/' + id,).pipe(
      tap((res: any) => this.cartSubject.next(res.data)) 
    );
  }

  updateCartCount(id: string, count: number): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'cart/' + id, {
      count: count
    },).pipe(
      tap((res: any) => this.cartSubject.next(res.data)) 
    );
  }


  checkOutSession(id: string, data: object): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + "orders/checkout-session/" + id + "?url=http://localhost:4200",
      data
    );
  }

  checkOutCash(id: string, data: object): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + "orders/" + id ,data
    );
  }



  getUserOrders(): Observable<Orders[]> {
    const decodedToken = this.authService.decodeToken();
    
    if (!decodedToken || !decodedToken.id) {
      throw new Error('User ID not found in token');
    }

    return this.httpClient.get<Orders[]>(
      environment.baseUrl + `orders/user/${decodedToken.id}`
    );

  }
}