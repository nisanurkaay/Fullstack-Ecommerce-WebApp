import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Router } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css'],
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
  availableColors: string[] = [];  // Will store available colors fetched from backend
  availableSizes = ['S', 'M', 'L', 'XL'];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyProducts();
    this.loadCategories();
    this.loadAvailableColors();  // Call the method to load colors
  }

  loadMyProducts(): void {
    const sellerId = Number(localStorage.getItem('userId'));
    if (!sellerId) return;

    this.productService.getMyProducts(sellerId).subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();  // Apply filters immediately after products are loaded
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

  loadAvailableColors(): void {
    this.productService.getColors().subscribe({
      next: (data) => this.availableColors = data,
      error: (err) => console.error('Error loading colors:', err)
    });
  }

  setFilter(status: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING') {
    this.filter = status;
    this.applyFilters();  // Apply filters immediately after status change
  }

  // Apply filters dynamically based on selected options
  applyFilters(): void {
    let filteredProducts = this.products;

    // Category filter
    if (this.selectedCategory) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === this.selectedCategory);
    }

    // Color filter
    if (this.selectedColors.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        p.color && this.selectedColors.includes(p.color) ||
        p.variants?.some(v => this.selectedColors.includes(v.color))
      );
    }

    // Size filter
    if (this.selectedSizes.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        p.variants?.some(v => this.selectedSizes.includes(v.size))
      );
    }

    // Filter by status (ALL, ACTIVE, INACTIVE, PENDING)
    if (this.filter !== 'ALL') {
      filteredProducts = filteredProducts.filter(p => p.productStatus === this.filter);
    }

    // Update the product list after applying all filters
    this.products = filteredProducts;
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

  // Toggle color filter
  toggleColor(color: string): void {
    if (this.selectedColors.includes(color)) {
      this.selectedColors = this.selectedColors.filter(c => c !== color);
      this.applyFilters();
    } else {
      this.selectedColors.push(color);
    }
    this.applyFilters();  // Apply filter immediately after toggle
  }

  // Toggle size filter
  toggleSize(size: string): void {
    if (this.selectedSizes.includes(size)) {
      this.selectedSizes = this.selectedSizes.filter(s => s !== size);
      this.applyFilters();
    } else {
      this.selectedSizes.push(size);
    }
    this.applyFilters();  // Apply filter immediately after toggle
  }

  // Deactivate product
  deactivateProduct(id: number) {
    const sellerId = Number(localStorage.getItem('userId'));
    this.productService.deactivate(id, sellerId).subscribe({
      next: () => this.loadMyProducts(),
      error: (err) => console.error('Yayından kaldırma hatası:', err)
    });
  }

  // Confirm product deletion
  confirmDeleteProduct(id: number) {
    const confirmed = confirm('Are you sure you want to delete this product and all variants?');
    if (!confirmed) return;

    const sellerId = Number(localStorage.getItem('userId'));
    this.productService.hardDelete(id, sellerId).subscribe({
      next: () => this.loadMyProducts(),
      error: (err) => console.error('Silme hatası:', err)
    });
  }

  // Confirm variant deletion
  confirmDeleteVariant(productId: number, variantId: number) {
    const confirmed = confirm('Are you sure you want to delete this variant?');
    if (!confirmed) return;

    this.productService.deleteVariant(productId, variantId).subscribe({
      next: () => this.loadMyProducts(),
      error: (err) => console.error('Varyant silme hatası:', err)
    });
  }

  // Activate product
  activateProduct(id: number) {
    const sellerId = Number(localStorage.getItem('userId'));

    this.productService.getById(id).subscribe({
      next: (product) => {
        const hasVariants = product.variants && product.variants.length > 0;

        // Check for 3 images in product or variants
        if (!hasVariants && (!product.imageUrls || product.imageUrls.length !== 3)) {
          alert('Varyantsız ürünlerde tam 3 görsel yüklenmelidir.');
          return;
        }

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

  // Edit product
  editProduct(product: Product) {
    this.router.navigate(['/seller/edit-product', product.id]);
  }

  // Toggle variants visibility
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
