import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  incrementQuantity(productId: number, color: string, size: string): void {
    this.cartService.incrementQuantity(productId, color, size);
  }

  decrementQuantity(productId: number, color: string, size: string): void {
    this.cartService.decrementQuantity(productId, color, size);
  }

  removeItem(productId: number, color: string, size: string): void {
    this.cartService.removeItem(productId, color, size);
  }

  clearAll(): void {
    this.cartService.clearCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }
}
