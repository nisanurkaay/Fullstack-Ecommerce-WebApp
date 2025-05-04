import { Component, OnInit } from '@angular/core';
import { Product,ProductVariant } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { Router } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css'],
  standalone:false
})
export class MyProductsComponent implements OnInit {
  products: Product[] = [];
  filter: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING' = 'ALL';
  expandedProductIds: Set<number> = new Set();
  categories: Category[] = [];
  selectedCategory: number | null = null;
  selectedColors: string[] = [];
  selectedSizes: string[] = [];
  showVariantsAsProducts = false;
  availableColors = ['RED', 'BLUE', 'GREEN', 'BLACK', 'WHITE'];
  availableSizes = ['S', 'M', 'L', 'XL'];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyProducts();
    this.loadCategories();
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

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Kategori yüklenemedi:', err)
    });
  }
  setFilter(status: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING') {
    this.filter = status;
  }

  applyFilters(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.productService.filterMyProducts(
      this.selectedCategory,
      this.selectedColors,
      this.selectedSizes,
      userId
    ).subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Filtreleme hatası:', err)
    });
  }

  get filteredProducts(): Product[] {
    const baseList = this.filter === 'ALL'
      ? this.products
      : this.products.filter(p => p.productStatus === this.filter);

    // Varyantları ayrı ürün gibi göster
    if (this.showVariantsAsProducts) {
      const flat: Product[] = [];
      baseList.forEach(p => {
        if (p.variants && p.variants.length > 0) {
          for (const v of p.variants) {
            flat.push({
              ...p,
              price: v.price,
              stockQuantity: v.stock,
              imageUrls: v.imageUrls,
              color: v.color,
              variants: [], // varyantı varyantsız ürün gibi göster
            });
          }
        } else {
          flat.push(p); // varyantsız ürünü direkt ekle
        }
      });
      return flat;
    }

    return baseList;
  }

  deactivateProduct(id: number) {
    const sellerId = Number(localStorage.getItem('userId'));
    this.productService.delete(id, sellerId).subscribe(() => this.loadMyProducts());
  }
  confirmDeleteProduct(id: number) {
    const confirmed = confirm('Are you sure you want to delete this product and all variants?');
    if (!confirmed) return;

    const sellerId = Number(localStorage.getItem('userId'));
    this.productService.hardDelete(id, sellerId).subscribe({
      next: () => this.loadMyProducts(),
      error: (err) => console.error('Silme hatası:', err)
    });
  }
  confirmDeleteVariant(productId: number, variantId: number) {
    const confirmed = confirm('Are you sure you want to delete this variant?');
    if (!confirmed) return;

    this.productService.deleteVariant(productId, variantId).subscribe({
      next: () => this.loadMyProducts(),
      error: (err) => console.error('Varyant silme hatası:', err)
    });
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
  editProduct(product: Product) {
    this.router.navigate(['/seller/edit-product', product.id]);
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

  toggleColor(color: string): void {
    const index = this.selectedColors.indexOf(color);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(color);
    }
  }

  toggleSize(size: string): void {
    const index = this.selectedSizes.indexOf(size);
    if (index > -1) {
      this.selectedSizes.splice(index, 1);
    } else {
      this.selectedSizes.push(size);
    }
  }


  hasVaryingPrices(p: Product): boolean {
    if (!p.variants || p.variants.length < 2) return false;
    const firstPrice = p.variants[0].price;
    return p.variants.some(v => v.price !== firstPrice);
  }
}
