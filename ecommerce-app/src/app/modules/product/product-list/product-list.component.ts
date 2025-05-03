import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const query = params.get('q')?.toLowerCase() || '';
      const categoryId = params.get('category');
if (categoryId) {
  const catId = Number(categoryId);
  this.filteredProducts = this.filteredProducts.filter(p => p.categoryId === catId);
}

      this.isLoading = true;
      this.productService.getAll().subscribe({
        next: (data: Product[]) => {
          this.products = data;
          this.filteredProducts = data;

          if (query) {
            this.filteredProducts = this.filteredProducts.filter(p =>
              p.name.toLowerCase().includes(query)
            );
          }

          if (categoryId) {
            const catId = Number(categoryId);
            this.filteredProducts = this.filteredProducts.filter(p =>
              p.categoryId === catId
            );
          }

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
