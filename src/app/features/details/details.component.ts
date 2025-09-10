import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsService } from './services/details.service';
import { Product } from '../../core/models/product.interface';
import { CartService } from '../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly detailsService = inject(DetailsService);
  private readonly toasterServices = inject(ToastrService);
  private readonly cartService = inject(CartService);
  
    addProductItemToCart(id: string): void {
      this.cartService.addProductToCart(id).subscribe({
        next: (res: any) =>{
          console.log('Product added to cart:', res);
          if(res.status === 'success'){
            this.toasterServices.success(res.message,'FreshCart');
          }
        } 
        
        ,
        error: (err: any) =>{
          console.error('Error adding product to cart:', err);
          this.toasterServices.error('Error adding product to cart');
        } 
      });
    }

  productDetails: Product ={} as Product;

  id: string | null = null;
  slug: string | null = null;

  ngOnInit(): void {
    this.getProductId();
    this.getProductSlug();

    this.getProductDetails();
  }

  getProductId():void {
     this.activatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.id = params.get('id');
        console.log('Product ID:', this.id);
      }
     })
  }
  getProductSlug():void {
     this.activatedRoute.paramMap.subscribe({
       next:(params)=>{
         this.slug = params.get('slug');
         console.log('Product Slug:', this.slug);
       }
     });
  }

  getProductDetails(): void {
    this.detailsService.getProductDetails(this.id).subscribe({
      next: (res) => {
        console.log('Product Details:', res);
        this.productDetails = res.data;
      },
      error: (error) => {
        console.error('Error fetching product details:', error);
      }
    });
  }

  

}
