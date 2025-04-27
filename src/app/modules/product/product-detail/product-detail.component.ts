import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Review } from '../../../core/models/review.model';
import { Product } from '../../../core/models/product.model';
import { ReviewService } from '../../../core/services/review.service';
import { ProductService } from '../../../core/services/product.service';


@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})export class ProductDetailComponent implements OnInit {
  productId!: number;
  product!: Product;
  productReviews = [];  // Empty for now or fetched separately if ready

  // Static size and color options (just for now)
  sizes: string[] = ['S', 'M', 'L', 'XL'];
  colors: string[] = ['black', 'green', 'blue'];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Get product id from URL
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    // Fetch product from API
    this.productService.getProduct(this.productId).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });
  }
}
