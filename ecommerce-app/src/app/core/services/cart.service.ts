import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../core/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
  size: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  // Ürünü sepete ekle
  addToCart(product: Product, color: string = '', size: string = ''): void {
    const existingItem = this.cartItems.find(item =>
      item.product.id === product.id &&
      item.color === color &&
      item.size === size
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1, color, size });
    }

    this.cartSubject.next(this.cartItems);
  }

  // Miktar artır
  incrementQuantity(productId: number, color?: string, size?: string): void {
    const item = this.cartItems.find(i =>
      i.product.id === productId &&
      i.color === color &&
      i.size === size
    );
    if (item) {
      item.quantity++;
      this.cartSubject.next(this.cartItems);
    }
  }

  // Miktar azalt
  decrementQuantity(productId: number, color?: string, size?: string): void {
    const item = this.cartItems.find(i =>
      i.product.id === productId &&
      i.color === color &&
      i.size === size
    );

    if (item && item.quantity > 1) {
      item.quantity--;
      this.cartSubject.next(this.cartItems);
    } else if (item) {
      this.removeItem(productId, color, size);
    }
  }

  // Sepetten sil
  removeItem(productId: number, color?: string, size?: string): void {
    this.cartItems = this.cartItems.filter(i =>
      !(i.product.id === productId && i.color === color && i.size === size)
    );
    this.cartSubject.next(this.cartItems);
  }

  // Sepeti temizle
  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
  }

  // Toplam fiyat
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) =>
      total + item.product.price * item.quantity, 0);
  }
}
