import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { Review } from '../../../core/models/review.model';
import { ProductService } from '../../../core/services/product.service';
import { ReviewService } from '../../../core/services/review.service';
import { CartService } from '../../../core/services/cart.service';
import { HttpClient } from '@angular/common/http';
import { ProductVariantResponse } from '@core/models/product-variant-response.model';



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

  sizes: string[] = [];
  colors: string[] = [];

  selectedColor: string | null = null;
  selectedSize: string | null = null;
  selectedImage: string = '';
  currentSlide = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private cartService: CartService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    // Ürün verisini getir
    this.productService.getById(this.productId).subscribe({
      next: (prod: Product) => {
        this.product = prod;
        this.selectedImage = prod.imageUrls?.[0] ?? '';
        this.extractVariants(prod.variants ?? []);
      },
      error: (e: any) => console.error(e)
    });

    // İnceleme verisini getir
    this.reviewService.getReviewsByProductId(this.productId).subscribe({
      next: (revs: Review[]) => this.productReviews = revs,
      error: (e: any) => console.error(e)
    });

    // Backend'den color enum listesini getir
    this.http.get<string[]>('http://localhost:8081/api/enums/colors').subscribe({
      next: (res) => {
        this.colors = res;
      },
      error: (e) => {
        console.error('Renk listesi alınamadı:', e);
      }
    });
  }


  // Varyantlardan unique renk ve beden çıkar
  extractVariants(variants: ProductVariantResponse[]) {
    const uniqueColors = new Set<string>();
    const uniqueSizes = new Set<string>();

    for (let v of variants) {
      if (v.color) uniqueColors.add(v.color);
      if (v.size) uniqueSizes.add(v.size);
    }

    // Eğer varyant boşsa, product.color fallback olarak eklenir
    if (uniqueColors.size === 0 && this.product.color) {
      uniqueColors.add(this.product.color);
    }

    this.colors = Array.from(uniqueColors);
    this.sizes = Array.from(uniqueSizes); // Eğer varyant yoksa boş kalabilir
  }



  selectColor(color: string) {
    this.selectedColor = color;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }



  addToCart(): void {
    if (!this.selectedColor /* || !this.selectedSize */) {
      alert('Please select color and size before adding to cart.');
      return;
    }

    this.cartService.addToCart(this.product, this.selectedColor, this.selectedSize!);
  }
}
