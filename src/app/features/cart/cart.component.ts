import { Component, inject, OnInit } from '@angular/core';
import { CartService } from './services/cart.service';
import { Cart } from './models/cart.interface';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  private readonly cartService = inject(CartService);
  private readonly toasterServices = inject(ToastrService);

  cardDetails: Cart = {} as Cart;

  getLoggedUserData() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res.data);
        this.cardDetails = res.data;

      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  removeItem(id: string) {
    this.cartService.removeSpecificProductFromCart(id).subscribe({
      next: (res) => {
        console.log(res);
        // this.getLoggedUserData();
        this.cardDetails = res.data;
        this.toasterServices.warning('Product removed from cart','FreshCart');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateItemCount(id: string, count: number) {
    this.cartService.updateCartCount(id, count).subscribe({
      next: (res) => {
        console.log(res);
        this.cardDetails = res.data;
        this.toasterServices.info('Product quantity updated','FreshCart');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
    this.getLoggedUserData();
  }

}
