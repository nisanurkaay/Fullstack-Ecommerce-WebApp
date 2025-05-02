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
  pendingProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  loadPendingProducts(): void {
    this.productService.getPendingProducts().subscribe({
      next: (res) => this.pendingProducts = res,
      error: (err) => console.error('Error loading pending products', err)
    });
  }

  approveProduct(id: number): void {
    this.productService.approveProduct(id).subscribe({
      next: () => this.loadPendingProducts(),
      error: (err) => console.error('Error approving product', err)
    });
  }

  denyProduct(id: number): void {
    this.productService.denyProduct(id).subscribe({
      next: () => this.loadPendingProducts(),
      error: (err) => console.error('Error denying product', err)
    });
  }
}
