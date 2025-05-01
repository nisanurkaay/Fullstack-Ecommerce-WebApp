import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartItem, CartService } from '@core/services/cart.service'; // CartItem'ı unutma!

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
  userName: string = '';

  constructor(
    public auth: AuthService,
    private router: Router,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });

    this.auth.currentUser$.subscribe(user => {
      this.userName = user?.name ?? '';
    });
  }


  // Diğer metotlar aynı kalır...

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
}
