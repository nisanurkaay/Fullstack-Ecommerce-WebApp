import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { Review } from '../../../core/models/review.model';
import { ProductService } from '../../../core/services/product.service';
import { ReviewService } from '../../../core/services/review.service';
import { CartService } from '../../../core/services/cart.service';
import { HttpClient } from '@angular/common/http';
import { ProductVariant } from '@core/models/product.model';
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
  displayedImage: string = '';
  currentImages: string[] = [];
  selectedVariant: ProductVariant | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private cartService: CartService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getById(this.productId).subscribe({
      next: (prod: Product) => {
        this.product = prod;

        // ✅ Görsel atama: varsa ilk varyanttan al, yoksa ana ürün görsellerinden
        if ((prod.variants ?? []).length > 0 && prod.variants![0].imageUrls?.length) {
          this.currentImages = prod.variants![0].imageUrls;
        } else {
          this.currentImages = prod.imageUrls ?? [];
        }

        this.selectedImage = this.currentImages[0] ?? '';

        // ✅ varyantlardan renk ve bedenleri çıkar
        this.extractVariants(prod.variants ?? []);
      },
      error: (e: any) => console.error(e)
    });

    this.reviewService.getReviewsByProductId(this.productId).subscribe({
      next: (revs: Review[]) => this.productReviews = revs,
      error: (e: any) => console.error(e)
    });



   /* this.http.get<string[]>('http://localhost:8081/api/enums/colors').subscribe({
      next: (res) => {
        this.colors = res;
      },
      error: (e) => {
        console.error('Renk listesi alınamadı:', e);
      }
    }); */
  }



  extractVariants(variants: ProductVariantResponse[]) {
    const uniqueColors = new Set<string>();
    const uniqueSizes = new Set<string>();

    // ✅ Varyantlı ürünler için renk ve bedenleri topla
    for (let v of variants) {
      if (v.color) uniqueColors.add(v.color);
      if (v.size) uniqueSizes.add(v.size);
    }

    // ✅ Varyantsız ürün için fallback olarak product.color ve STD beden
    if (variants.length === 0) {
      if (this.product.color) {
        uniqueColors.add(this.product.color);
      }
      if (this.product.stockQuantity > 0) {
        uniqueSizes.add('STD');
      }
    }

    this.colors = Array.from(uniqueColors);
    this.sizes = Array.from(uniqueSizes);

    console.log('🎨 Final Colors:', this.colors);
    console.log('📏 Final Sizes:', this.sizes);
  }





  selectColor(color: string) {
    this.selectedColor = color;
    this.updateSelectedVariant();
  }

  selectSize(size: string) {
    this.selectedSize = size;
    this.updateSelectedVariant();
  }

  updateSelectedVariant(): void {
    if (!this.product.variants || this.product.variants.length === 0) {
      // Varyantsız ürün için sadece color'a göre görüntü ve fiyat koruması
      this.currentImages = this.product.imageUrls ?? [];
      this.selectedImage = this.currentImages[0] ?? '';
      this.product.price = this.product.price ?? 0;
      return;
    }

    // Varyantlı ürünlerde eşleşen varyantı bul
    this.selectedVariant = this.product.variants.find(
      v =>
        (!this.selectedColor || v.color === this.selectedColor) &&
        (!this.selectedSize || v.size === this.selectedSize)
    ) || null;

    if (this.selectedVariant) {
      this.currentImages = this.selectedVariant.imageUrls ?? [];
      this.selectedImage = this.currentImages[0] ?? '';
      this.product.price = this.selectedVariant.price;
    }
  }





  selectImage(img: string): void {
    this.selectedImage = img;
  }

  addToCart(): void {
    if (!this.selectedColor || !this.selectedSize) {
      alert('Please select both color and size.');
      return;
    }

    this.cartService.addToCart(this.product, this.selectedColor, this.selectedSize);
  }

  selectVariant(variant: ProductVariant): void {
    this.selectedVariant = variant;
    this.selectedColor = variant.color;
    this.selectedSize = variant.size;
    this.product.price = variant.price;

    this.currentImages = variant.imageUrls ?? [];
    this.selectedImage = this.currentImages[0] ?? '';
  }
}
