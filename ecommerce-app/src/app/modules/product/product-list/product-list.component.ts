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
      this.productService.getAll().subscribe({
        next: (data: Product[]) => {
          this.products = data;
          this.filteredProducts = query
            ? data.filter((p: Product) => p.name.toLowerCase().includes(query))
            : data;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.error = 'Hata oluştu';
          this.isLoading = false;
        }
      });
    });
  }
}
