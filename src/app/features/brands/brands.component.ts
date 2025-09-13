import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Brand } from '../../core/models/brand.interface';
import { BrandsService } from './services/brand.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/search-pipe';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [ NgxPaginationModule, FormsModule, SearchPipe],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);

  brandsList: Brand[] = [];

  pageSize!: number;
  p!: number;
  total!: number;
  searchTerm: string = '';

  ngOnInit(): void {
    this.getAllBrandsData();
  }

  getAllBrandsData(pageNumber: number = 1): void {
    this.brandsService.getAllBrands(pageNumber).subscribe({
      next: (res: any) => {
        this.brandsList = res.data;
        this.pageSize = res.metadata.limit;
        this.total = res.results;
        this.p = res.metadata.currentPage;
      },
      error: (err) => console.error(err)
    });
  }

  // count: WritableSignal<number>=signal(0);
  // updateCount():void{
  //   this.count.update((value)=>value+1);
  // }



}