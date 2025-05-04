import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: false
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  colors: string[] = [];
  selectedCategories: number[] = [];
  selectedColors: string[] = [];
  selectedSizes: string[] = [];
  isLoading = true;
  error: string | null = null;
  showFilters = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // Fetch the colors available for filtering
    this.productService.getColors().subscribe({
      next: (data) => this.colors = data,
      error: () => this.colors = [] // If there's an error, leave the color array empty
    });

    // Fetch all categories
    this.categoryService.getAll().subscribe(cats => {
      this.categories = cats;
    });

    // Fetch all products
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Hata oluştu';
        this.isLoading = false;
      }
    });
  }

  // Toggle category filter
  toggleCategory(catId: number) {
    this.selectedCategories.includes(catId)
      ? this.selectedCategories = this.selectedCategories.filter(id => id !== catId)
      : this.selectedCategories.push(catId);
    this.applyFilters();
  }

  // Toggle color filter
  toggleColor(color: string) {
    this.selectedColors.includes(color)
      ? this.selectedColors = this.selectedColors.filter(c => c !== color)
      : this.selectedColors.push(color);
    this.applyFilters();
  }

  // Toggle size filter
  toggleSize(size: string) {
    this.selectedSizes.includes(size)
      ? this.selectedSizes = this.selectedSizes.filter(s => s !== size)
      : this.selectedSizes.push(size);
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      // Check if product matches the selected categories
      const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.includes(product.categoryId);

      // Check if product matches the selected colors (including variants)
      const matchesColor = this.selectedColors.length === 0 ||
        // Check if the product color itself matches the selected color
        this.selectedColors.includes(product.color!) ||
        // Check if any of the variants' color matches the selected colors
        product.variants?.some(variant => this.selectedColors.includes(variant.color));

      // Check if product matches the selected sizes (including variants)
      const matchesSize = this.selectedSizes.length === 0 ||
        product.variants?.some(variant => this.selectedSizes.includes(variant.size));

      return matchesCategory && matchesColor && matchesSize;
    });
  }

}
