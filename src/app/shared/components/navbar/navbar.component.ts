import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',

})
export class NavbarComponent implements OnInit {
  searchQuery = '';
  filteredOptions: string[] = [];
  cartCount = 2;
  isLoggedIn = false;

  constructor(private router: Router, private auth :AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
  }
  onSearch() {
    this.router.navigate(['/products'], {
      queryParams: this.searchQuery.trim()
        ? { q: this.searchQuery.trim() }
        : {} // ❗ boşsa query param gönderme
    });
  }
  logout() { this.isLoggedIn = false; }

  onReset() {
    this.searchQuery = '';

    // ❗ URL'deki ?q=... parametresini temizle
    this.router.navigate(['/products'], {
      queryParams: {}
    });
  }

}
