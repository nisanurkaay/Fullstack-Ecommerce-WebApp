import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-seller',
  standalone: false,
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.css'
})
export class SellerComponent {
 isSidebarOpen = window.innerWidth >= 1024;
  isLargeScreen = window.innerWidth >= 1024;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.isLargeScreen = width >= 1024;
    this.isSidebarOpen = this.isLargeScreen;
  }
}
