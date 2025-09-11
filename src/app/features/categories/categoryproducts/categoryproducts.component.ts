import { CartService } from './../../cart/services/cart.service';
import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../../core/services/products/products.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.interface';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe } from '@angular/common';
import { TermPipe } from '../../../shared/pipes/term-pipe';
import { WishlistService } from '../../wishlist/services/wishlist.service';


@Component({
  selector: 'app-categoryproducts',
  imports: [RouterLink,
    TermPipe,
    CurrencyPipe
  ],
  templateUrl: './categoryproducts.component.html',
  styleUrl: './categoryproducts.component.css'
})
export class CategoryProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly toasterServices = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);
  

  productsList: Product[] = [];
  categoryId!: string;
  categoryName!: string;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id')!;
      this.getProductsByCategory(this.categoryId);
    });
  }

  getProductsByCategory(categoryId: string): void {
    this.productsService.getAllProducts().subscribe({
      next: (res: any) => {
        this.productsList = res.data.filter(
          (p: Product) => p.category && p.category._id === categoryId
        );

        if (this.productsList.length > 0) {
          this.categoryName = this.productsList[0].category.name;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

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

  addProductItemToWishlist(id: string) {
    this.wishlistService.addProductToWishlist(id).subscribe({
      next: () => this.toasterServices.success("Product added to wishlist", "Wishlist"),
      error: (err) => console.error(err)
    });
  }


}


