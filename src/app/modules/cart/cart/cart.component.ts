import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../../core/services/cart.service'; // kendi proje yapına göre yolu düzelt

@Component({
  selector: 'app-cart',
  standalone:false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'] // Eğer style kullanıyorsan
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  incrementQuantity(productId: number): void {
    this.cartService.incrementQuantity(productId);
  }

  decrementQuantity(productId: number): void {
    this.cartService.decrementQuantity(productId);
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  clearAll(): void {
    this.cartService.clearCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }
}
