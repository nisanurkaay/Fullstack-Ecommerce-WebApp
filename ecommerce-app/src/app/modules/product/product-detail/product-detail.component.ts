import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductVariant } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { ReviewService } from '@core/services/review.service';
import { CartService } from '@core/services/cart.service';
import { Review } from '@core/models/review.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  variantId: number | null = null;

  product!: Product;
  selectedVariant: ProductVariant | null = null;
  productReviews: Review[] = [];

  colors: string[] = [];
  sizes: string[] = [];

  selectedColor: string | null = null;
  selectedSize: string | null = null;

  currentImages: string[] = [];
  selectedImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    const variantParam = this.route.snapshot.queryParamMap.get('variantId');
    this.variantId = variantParam ? Number(variantParam) : null;

    this.productService.getById(this.productId).subscribe({
      next: (prod) => {
        this.product = prod;
        this.extractVariants(prod.variants ?? []);

        if (this.variantId) {
          // 👉 Direkt varyanttan detayları set et
          const match = prod.variants?.find(v => v.id === this.variantId);
          if (match) {
            this.selectVariant(match);
          }
        } else {
          // 👉 Varyantsız ya da seçimli: ilk görseli göster
          this.currentImages = (prod.imageUrls?.length ?? 0) > 0
            ? prod.imageUrls!
            : prod.variants?.[0]?.imageUrls ?? [];
          this.selectedImage = this.currentImages[0] ?? '';
        }
      },
      error: (e) => console.error('Product load error', e)
    });

    this.reviewService.getReviewsByProductId(this.productId).subscribe({
      next: (revs) => this.productReviews = revs,
      error: (e) => console.error('Review error', e)
    });
  }

  extractVariants(variants: ProductVariant[]): void {
    const colorSet = new Set<string>();
    const sizeSet = new Set<string>();

    for (let v of variants) {
      if (v.color) colorSet.add(v.color);
      if (v.size) sizeSet.add(v.size);
    }

    // fallback - varyantsızsa
    if (variants.length === 0) {
      if (this.product.color) colorSet.add(this.product.color);
      if (this.product.stockQuantity > 0) sizeSet.add('STD');
    }

    this.colors = Array.from(colorSet);
    this.sizes = Array.from(sizeSet);
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
      this.selectedVariant = null;
      return;
    }

    if (!this.selectedColor || !this.selectedSize) {
      this.selectedVariant = null;
      return;
    }

    this.selectedVariant = this.product.variants.find(
      v => v.color === this.selectedColor && v.size === this.selectedSize
    ) || null;

    if (this.selectedVariant) {
      this.currentImages = this.selectedVariant.imageUrls ?? [];
      this.selectedImage = this.currentImages[0] ?? '';
      this.product.price = this.selectedVariant.price;
    } else {
      console.warn("❌ Seçilen renk ve bedene uygun varyant bulunamadı.");
    }
  }


  selectImage(img: string): void {
    this.selectedImage = img;
  }

  selectVariant(variant: ProductVariant): void {
    this.selectedVariant = variant;
    this.selectedColor = variant.color;
    this.selectedSize = variant.size;
    this.product.price = variant.price;
    this.currentImages = variant.imageUrls ?? [];
    this.selectedImage = this.currentImages[0] ?? '';
  }

  addToCart(): void {
    if (this.product.variants?.length) {
      if (!this.selectedColor || !this.selectedSize) {
        alert('Lütfen renk ve beden seçiniz.');
        return;
      }

      // ✅ Backend'den variantId'yi çek
      this.productService
        .getVariantId(this.productId, this.selectedColor, this.selectedSize)
        .subscribe({
          next: (variantId) => {
            this.cartService.addToCart(
              this.product,
              this.selectedColor!,
              this.selectedSize!,
              variantId
            );
          },
          error: () => {
            alert('Seçilen renk ve beden için varyant bulunamadı.');
          }
        });

    } else {
      // Varyantsız ürün
      this.cartService.addToCart(this.product);
    }
  }


}
