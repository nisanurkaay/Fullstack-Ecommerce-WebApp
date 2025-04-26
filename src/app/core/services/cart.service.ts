import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<Product[]>([]);
  getCart(): Observable<Product[]> {
    return this.itemsSubject.asObservable();
  }
  addToCart(product: Product): void {
    const items = this.itemsSubject.value;
    this.itemsSubject.next([...items, product]);
  }
  removeFromCart(index: number): void {
    const items = this.itemsSubject.value.filter((_, i) => i !== index);
    this.itemsSubject.next(items);
  }
  clearCart(): void {
    this.itemsSubject.next([]);
  }
}
