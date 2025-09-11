import { CartService } from './../cart/services/cart.service';
import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from './services/wishlist.service';
import { Product } from '../../core/models/product.interface';
import { CurrencyPipe } from '@angular/common';
import { TermPipe } from '../../shared/pipes/term-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [
    TermPipe,
    CurrencyPipe,
    RouterLink
],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);


  wishlist: Product[] = [];

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlist = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  removeFromWishlist(id: string): void {
    this.wishlistService.removeProductFromWishlist(id).subscribe({
      next: () => this.loadWishlist(),
      error: (err) => console.error(err)
    });
  }

  addToCart(id: string) {
  this.cartService.addProductToCart(id).subscribe({
    next: () => {
      console.log('Product added to cart');
    },
    error: (err) => console.error(err)
  });
}

}