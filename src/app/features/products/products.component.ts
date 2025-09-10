import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { ProductsService } from '../../core/services/products/products.service';
import { Product } from '../../core/models/product.interface';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { SearchPipe } from '../../shared/pipes/search-pipe';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-products',
  imports: [CardComponent, NgxPaginationModule, SearchPipe, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  productsList: Product[] = [];

  pageSize!: number ;
  p!: number;
  total!: number;
  searchTerm: string = '';

  ngOnInit(): void {
    this.getAllProductsData();
  }
  getAllProductsData(pageNumber: number = 1): void {
    this.productsService.getAllProducts(pageNumber).subscribe({
      next:(res: any)=>{
        this.productsList = res.data;

        this.pageSize = res.metadata.limit;
        this.total = res.results;
        this.p = res.metadata.currentPage;
      },
      error: (err) => {
        console.error(err);
      }

    });
  }

  // pageChanged(pageNumber: number):void {
  //   this.p = pageNumber;
  //   this.getAllProductsData(pageNumber);
  // }
}
