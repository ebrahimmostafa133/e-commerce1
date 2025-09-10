import { Component, inject, Inject, Input } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { RouterLink } from '@angular/router';
import { OnSalePipe } from '../../pipes/on-sale-pipe';
import { TermPipe } from '../../pipes/term-pipe';
import { CartService } from '../../../features/cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [RouterLink,
    // OnSalePipe,
    TermPipe,
    CurrencyPipe
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input({required: true}) product : Product ={} as Product;
  private readonly cartService = inject(CartService);
  private readonly toasterServices = inject(ToastrService);

  addProductItemToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res: any) => {
        console.log('Product added to cart:', res);
        if(res.status === 'success'){
          this.toasterServices.success(res.message,'FreshCart');
        }
      },
      error: (err: any) => {
        console.error('Error adding product to cart:', err);
        this.toasterServices.error('Error adding product to cart');
      }
    });
  }

}
