import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>([]);


  getCart(): Observable<Product[]> {
    return this.cartSubject.asObservable();
  }


  addToCart(product: Product): void {
    this.items.push(product);
    this.cartSubject.next(this.items);
  }


  removeFromCart(index: number): void {
    this.items.splice(index, 1);
    this.cartSubject.next(this.items);
  }


  clearCart(): void {
    this.items = [];
    this.cartSubject.next(this.items);
  }
}
