// src/app/shared/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '@core/models/product.model';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchQuery = '';
  filteredOptions: string[] = [];
  cartCount = 0;
  cartItems: Product[] = [];

  constructor(
    public auth: AuthService,
    private router: Router,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    // Sepetteki öğeleri dinle, count'u güncelle
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.cartCount = items.length;
    });
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

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
}
