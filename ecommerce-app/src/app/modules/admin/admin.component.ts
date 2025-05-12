import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
 isSidebarOpen = window.innerWidth >= 1024;
  isLargeScreen = window.innerWidth >= 1024 ;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen ;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.isLargeScreen = width >= 1024;
    this.isSidebarOpen = this.isLargeScreen;
  }
}
