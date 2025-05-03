import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartItem, CartService } from '@core/services/cart.service';
import { Category } from '@core/models/category.model';
import { CategoryService } from '@core/services/category.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone:false
})
export class NavbarComponent implements OnInit {
  searchQuery = '';
  cartCount = 0;
  cartItems: CartItem[] = [];
  userName: string = '';
  categories: Category[] = [];
  expandedId: number | null = null;
  showDropdown = false;
  hoveredCategoryId: number | null = null;

  constructor(
    public auth: AuthService,
    private router: Router,
    public cartService: CartService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });

    this.auth.currentUser$.subscribe(user => {
      this.userName = user?.name ?? '';
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data;
    });
  }

  getMainCategories(): Category[] {
    return this.categories.filter(cat => !cat.parentId);
  }

  getSubcategories(parentId: number): Category[] {
    return this.categories.filter(cat => cat.parentId === parentId);
  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/products'], { queryParams: { categoryId } });
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  onSearch(): void {
    this.router.navigate(['/products'], {
      queryParams: this.searchQuery.trim()
        ? { q: this.searchQuery.trim() }
        : {}
    });
  }

  onReset(): void {
    this.searchQuery = '';
    this.router.navigate(['/products'], { queryParams: {} });
  }

  removeFromCart(productId: number): void {
    this.cartService.removeItem(productId);
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

}
