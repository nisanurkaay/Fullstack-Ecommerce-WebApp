// src/app/modules/product/components/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';


@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

  export class ProductListComponent implements OnInit {
    products: Product[] = [];
    isLoading = true;
    error: string | null = null;

    constructor(private productService: ProductService) {}

    ngOnInit() {
      this.productService.getProducts().subscribe({
        next: prods => {
          this.products = prods;
          this.isLoading = false;
        },
        error: err => {
          console.error(err);
          this.error = 'Ürünleri yüklerken bir hata oluştu.';
          this.isLoading = false;
        }
      });
    }
  }
