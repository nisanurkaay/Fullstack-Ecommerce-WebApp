import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Router } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.css',
  standalone: false
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
  availableColors: string[] = [];
  availableSizes = ['S', 'M', 'L', 'XL'];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyProducts();
    this.loadCategories();
    this.loadAvailableColors();
  }

  loadMyProducts(): void {
    const sellerId = Number(localStorage.getItem('userId'));
    if (!sellerId) return;

    this.productService.getMyProducts(sellerId).subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
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

  hasStockOrVariantStock(p: Product): boolean {
    if (p.stockQuantity && p.stockQuantity > 0) {
      return true;
    }
    return !!(p.variants && p.variants.length > 0 && p.variants.some(v => v.stock && v.stock > 0));
  }

  loadAvailableColors(): void {
    this.productService.getColors().subscribe({
      next: (data) => this.availableColors = data,
      error: (err) => console.error('Error loading colors:', err)
    });
  }

  setFilter(status: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING') {
    this.filter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    let filteredProducts = this.products;

    if (this.selectedCategory) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === this.selectedCategory);
    }

    if (this.selectedColors.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        p.color && this.selectedColors.includes(p.color) ||
        p.variants?.some(v => this.selectedColors.includes(v.color))
      );
    }

    if (this.selectedSizes.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        p.variants?.some(v => this.selectedSizes.includes(v.size))
      );
    }

    if (this.filter !== 'ALL') {
      filteredProducts = filteredProducts.filter(p => p.productStatus === this.filter);
    }

    this.products = filteredProducts;
  }

  get filteredProducts(): Product[] {
    const baseList = this.filter === 'ALL'
      ? this.products
      : this.products.filter(p => p.productStatus === this.filter);

    return baseList.filter(p => {
      const matchCategory = !this.selectedCategory || p.categoryId === this.selectedCategory;
      const matchColor = this.selectedColors.length === 0 ||
        (p.color && this.selectedColors.includes(p.color)) ||
        p.variants?.some(v => this.selectedColors.includes(v.color));
      const matchSize = this.selectedSizes.length === 0 ||
        p.variants?.some(v => this.selectedSizes.includes(v.size));
      return matchCategory && matchColor && matchSize;
    });
  }

  toggleColor(color: string): void {
    if (this.selectedColors.includes(color)) {
      this.selectedColors = this.selectedColors.filter(c => c !== color);
      this.applyFilters();
    } else {
      this.selectedColors.push(color);
    }
    this.applyFilters();
  }

  toggleSize(size: string): void {
    if (this.selectedSizes.includes(size)) {
      this.selectedSizes = this.selectedSizes.filter(s => s !== size);
      this.applyFilters();
    } else {
      this.selectedSizes.push(size);
    }
    this.applyFilters();
  }

  deactivateProduct(id: number) {
    const sellerId = Number(localStorage.getItem('userId'));
    this.productService.deactivate(id, sellerId).subscribe({
      next: () => this.loadMyProducts(),
      error: (err) => console.error('Yayından kaldırma hatası:', err)
    });
  }

  deactivateVariant(variantId: number) {
    this.productService.deactivateVariant(variantId).subscribe({
      next: () => this.loadMyProducts(),
      error: (err) => console.error('Varyant yayından kaldırma hatası:', err)
    });
  }

  activateVariant(variantId: number) {
    this.productService.activateVariant(variantId).subscribe({
      next: () => this.loadMyProducts(),
      error: (err) => console.error('Varyant yayına alma hatası:', err)
    });
  }

  activateWithVariants(productId: number): void {
    const sellerId = Number(localStorage.getItem('userId'));
    this.productService.activateWithVariants(productId, sellerId).subscribe({
      next: () => this.loadMyProducts(),
      error: err => alert(err.error?.message || 'Aktifleştirme başarısız!')
    });
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

        if (hasVariants) {
          const allVariantsValid = product.variants!.every(v =>
            v.stock > 0 && v.imageUrls?.length === 3
          );

          if (!allVariantsValid) {
            alert('Her varyantın en az 1 stoğu olmalı ve 3 görseli olmalı.');
            return;
          }

          this.productService.activateWithVariants(id, sellerId).subscribe(() => this.loadMyProducts());

        } else {
          if (!product.imageUrls || product.imageUrls.length !== 3 || product.stockQuantity === 0) {
            alert('Varyantsız ürünlerde 3 görsel ve en az 1 stok olmalı.');
            return;
          }

          this.productService.activate(id, sellerId).subscribe(() => this.loadMyProducts());
        }
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

  hasVaryingPrices(p: Product): boolean {
    if (!p.variants || p.variants.length < 2) return false;
    const firstPrice = p.variants[0].price;
    return p.variants.some(v => v.price !== firstPrice);
  }
}
