// src/app/modules/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { Review } from '../../../core/models/review.model';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']   // <-- çoğul
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  product!: Product;
  productReviews: Review[] = [];                  // tipi Review[]
  sizes: string[] = ['S', 'M', 'L', 'XL'];
  colors: string[] = ['black', 'green', 'blue'];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private cartService: CartService             // CartService inject
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(this.productId).subscribe({
      next: prod => this.product = prod,
      error: e => console.error(e)
    });
    this.reviewService.getReviewsByProductId(this.productId).subscribe({
      next: revs => this.productReviews = revs,
      error: e => console.error(e)
    });
  }

  /** Sepete ürün ekle */
  addToCart(): void {
    this.cartService.addToCart(this.product);
  }
}
