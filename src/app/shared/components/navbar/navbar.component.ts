import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',

})
export class NavbarComponent {
  searchQuery = '';
  filteredOptions: string[] = [];
  allOptions: string[] = ['Laptop', 'Phone', 'Headphones', 'Shoes']; // örnek ürünler
  cartCount = 2;
  isLoggedIn = false;

  constructor(private router: Router) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }
  logout() { this.isLoggedIn = false; }

    onReset() {
      this.searchQuery = '';
      // eğer autocomplete veya filtreleme yapıyorsanız onları da temizleyin
      // this.filteredOptions = [];
    }

}
