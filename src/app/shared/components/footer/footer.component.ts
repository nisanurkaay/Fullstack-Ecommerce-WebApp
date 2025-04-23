import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone:false
})
export class FooterComponent {
  email = '';
  subscribe() {
    // Örnek fonksiyon
    alert('Subscribed: ' + this.email);
    this.email = '';
  }
}
