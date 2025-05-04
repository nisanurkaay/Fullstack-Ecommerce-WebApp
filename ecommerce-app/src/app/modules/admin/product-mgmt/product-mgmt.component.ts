import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-mgmt',
  templateUrl: './product-mgmt.component.html',
  styleUrls: ['./product-mgmt.component.css'],
  standalone:false
})
export class ProductMgmtComponent implements OnInit {
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  selectedStatus: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BANNED' = 'ALL';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProductsByStatus('ALL');
  }

  loadProductsByStatus(status: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BANNED'): void {
    if (status === 'ALL') {
      this.productService.getAllForAdmin().subscribe({
        next: res => {
          this.allProducts = res;
          this.displayedProducts = res;
        },
        error: err => console.error('Failed to load all products', err)
      });
    } else {
      this.productService.getProductsByStatus(status).subscribe({
        next: res => this.displayedProducts = res,
        error: err => console.error(`Failed to load ${status} products`, err)
      });
    }

    this.selectedStatus = status;
  }

  toggleBan(product: Product): void {
    const action = product.productStatus === 'BANNED'
      ? this.productService.unbanProduct(product.id!)
      : this.productService.banProduct(product.id!);

    action.subscribe({
      next: () => this.loadProductsByStatus(this.selectedStatus),
      error: err => console.error('Ban/unban error:', err)
    });
  }
  approveProduct(id: number): void {
    this.productService.approveProduct(id).subscribe({
      next: () => this.loadProductsByStatus(this.selectedStatus),
      error: err => console.error('Error approving product', err)
    });
  }

  denyProduct(id: number): void {
    this.productService.denyProduct(id).subscribe({
      next: () => this.loadProductsByStatus(this.selectedStatus),
      error: err => console.error('Error denying product', err)
    });
  }
}
