import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartService, CartItem } from '@core/services/cart.service'; // CartItem'ı unutma!

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
  cartItems: CartItem[] = [];

  constructor(
    public auth: AuthService,
    private router: Router,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      // toplam ürün adedini quantity'lerden toplayarak bulacağız
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
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

  removeFromCart(productId: number): void {
    this.cartService.removeItem(productId);
  }
}
