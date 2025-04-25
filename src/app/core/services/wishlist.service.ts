// src/app/core/services/wishlist.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<Product[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  getWishlist(): Observable<Product[]> {
    return this.wishlist$;
  }

  addToWishlist(product: Product): void {
    const current = this.wishlistSubject.getValue();
    const exists = current.some(p => p.id === product.id);
    if (!exists) {
      this.wishlistSubject.next([...current, product]);
    }
  }

  removeFromWishlist(id: number): void {
    const updated = this.wishlistSubject.getValue().filter(p => p.id !== id);
    this.wishlistSubject.next(updated);
  }

  clearWishlist(): void {
    this.wishlistSubject.next([]);
  }
}
