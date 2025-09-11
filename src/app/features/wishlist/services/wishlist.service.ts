import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Wishlist } from '../models/wishlist.interface';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);

  private wishlistSubject = new BehaviorSubject<any>(null);
  wishlist$ = this.wishlistSubject.asObservable();

  // Add product to wishlist
  addProductToWishlist(id: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'wishlist', {
      productId: id
    }).pipe(
      tap((res: any) => this.wishlistSubject.next(res.data))
    );
  }

  // Get logged user wishlist
  getLoggedUserWishlist(): Observable<Wishlist> {
    return this.httpClient.get<Wishlist>(environment.baseUrl + 'wishlist').pipe(
      tap((res: Wishlist) => this.wishlistSubject.next(res.data))
    );
  }

  // Remove product from wishlist
  removeProductFromWishlist(id: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'wishlist/' + id).pipe(
      tap((res: any) => this.wishlistSubject.next(res.data))
    );
  }
}
