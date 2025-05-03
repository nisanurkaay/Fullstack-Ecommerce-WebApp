import { Component, OnInit } from '@angular/core';
import { Product,ProductVariant } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css'],
  standalone:false
})export class MyProductsComponent implements OnInit {
  products: Product[] = [];
  filter: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING' = 'ALL';
  expandedProductIds: Set<number> = new Set();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadMyProducts();
  }

  loadMyProducts(): void {
    const sellerId = Number(localStorage.getItem('userId'));
    if (!sellerId) return;

    this.productService.getMyProducts(sellerId).subscribe({
      next: (data) => {
        console.log("✔ Gelen ürünler:", data);
        this.products = data;
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  setFilter(status: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING') {
    this.filter = status;
  }

  get filteredProducts(): Product[] {
    if (this.filter === 'ALL') return this.products;
    return this.products.filter(p => p.productStatus === this.filter);
  }

  deactivateProduct(id: number) {
    const sellerId = Number(localStorage.getItem('userId'));
    this.productService.delete(id, sellerId).subscribe(() => this.loadMyProducts());
  }

  activateProduct(id: number) {
    const sellerId = Number(localStorage.getItem('userId'));

    this.productService.getById(id).subscribe({
      next: (product) => {
        const hasVariants = product.variants && product.variants.length > 0;

        // Ana ürün görselleri
        if (!hasVariants && (!product.imageUrls || product.imageUrls.length !== 3)) {
          alert('Varyantsız ürünlerde tam 3 görsel yüklenmelidir.');
          return;
        }

        // Varyant görsel kontrolü
        if (hasVariants && product.variants?.some(v => !v.imageUrls || v.imageUrls.length !== 3)) {
          alert('Her varyant için tam 3 görsel yüklenmelidir.');
          return;
        }

        this.productService.activate(id, sellerId).subscribe(() => this.loadMyProducts());
      },
      error: (err) => {
        console.error('Ürün detayları alınamadı:', err);
      }
    });
  }

  toggleVariants(productId: number): void {
    if (this.expandedProductIds.has(productId)) {
      this.expandedProductIds.delete(productId);
    } else {
      this.expandedProductIds.add(productId);
    }
  }

  isExpanded(productId: number): boolean {
    return this.expandedProductIds.has(productId);
  }

  hasVaryingPrices(p: Product): boolean {
    if (!p.variants || p.variants.length < 2) return false;
    const firstPrice = p.variants[0].price;
    return p.variants.some(v => v.price !== firstPrice);
  }
}
