// src/app/modules/product/components/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

  export class ProductListComponent implements OnInit {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    isLoading = true;
    error: string | null = null;

    constructor(private productService: ProductService, private route: ActivatedRoute) {}

    ngOnInit() {
      this.route.queryParamMap.subscribe(params => {
        const query = params.get('q')?.toLowerCase() || '';

        this.isLoading = true;
        this.productService.getProducts().subscribe({
          next: data => {
            this.products = data;
            this.filteredProducts = query
              ? data.filter(p => p.title.toLowerCase().includes(query))
              : data; // 👈 boşsa hepsini göster
            this.isLoading = false;
          },
          error: err => {
            this.error = 'Hata oluştu';
            this.isLoading = false;
          }
        });
      });
    }

  }
