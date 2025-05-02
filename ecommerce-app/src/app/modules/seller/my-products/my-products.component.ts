import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css'],
  standalone:false
})
export class MyProductsComponent implements OnInit {
  products: Product[] = [];
  filter: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING' = 'ALL';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadMyProducts();
  }

  loadMyProducts(): void {
    const seller = JSON.parse(localStorage.getItem('user')!);
    const sellerId = seller?.id;

    if (!sellerId) return;

    this.productService.getMyProducts(sellerId).subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  get filteredProducts(): Product[] {
    if (this.filter === 'ALL') return this.products;
    return this.products.filter(p => p.productStatus === this.filter);
  }

  setFilter(status: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING') {
    this.filter = status;
  }

  deactivateProduct(id: number) {
    const seller = JSON.parse(localStorage.getItem('user')!);
    this.productService.delete(id, seller.id).subscribe(() => this.loadMyProducts());
  }

  activateProduct(id: number) {
    const seller = JSON.parse(localStorage.getItem('user')!);
    this.productService.activate(id, seller.id).subscribe(() => this.loadMyProducts());
  }
}
