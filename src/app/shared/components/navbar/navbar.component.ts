import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  onSearch() {
    this.filteredOptions = this.allOptions.filter(option =>
      option.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  logout() { this.isLoggedIn = false; }
}
