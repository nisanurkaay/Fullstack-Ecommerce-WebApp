import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { Review } from '../../../core/models/review.model';
import { ProductService } from '../../../core/services/product.service';
import { ReviewService } from '../../../core/services/review.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  product!: Product;
  productReviews: Review[] = [];
  sizes: string[] = ['S', 'M', 'L', 'XL'];
  colors: string[] = ['black', 'green', 'blue'];
  currentSlide = 0;
  selectedImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(this.productId).subscribe({
      next: (prod: Product) => {
        this.product = prod;
        this.selectedImage = prod.imageUrls?.[0] ?? ''; // İlk resmi ayarla
      },
      error: (e: any) => console.error(e)
    });

    this.reviewService.getReviewsByProductId(this.productId).subscribe({
      next: (revs: Review[]) => this.productReviews = revs,
      error: (e: any) => console.error(e)
    });
  }

  nextSlide(): void {
    if (this.product?.imageUrls?.length) {
      this.currentSlide = (this.currentSlide + 1) % this.product.imageUrls.length;
    }
  }

  prevSlide(): void {
    if (this.product?.imageUrls?.length) {
      this.currentSlide = (this.currentSlide - 1 + this.product.imageUrls.length) % this.product.imageUrls.length;
    }
  }



  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
  selectImage(img: string): void {
    this.selectedImage = img;
  }
}
