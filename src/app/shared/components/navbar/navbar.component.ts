// src/app/shared/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone:false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  searchQuery = '';
  filteredOptions: string[] = [];
  cartCount = 2;

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

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

