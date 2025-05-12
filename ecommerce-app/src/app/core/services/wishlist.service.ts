import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<Product[]>([]);
  private wishlist: Product[] = [];

  constructor() {
    this.loadWishlist();
  }


  private saveWishlist(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    this.wishlistSubject.next(this.wishlist);
  }


  private loadWishlist(): void {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      this.wishlist = JSON.parse(storedWishlist);
      this.wishlistSubject.next(this.wishlist);
    }
  }


  getWishlist() {
    return this.wishlistSubject.asObservable();
  }

  addToWishlist(product: Product): void {
    if (!this.isInWishlist(product)) {
      this.wishlist.push(product);
      this.saveWishlist();
    }
  }


  removeFromWishlist(product: Product): void {
    this.wishlist = this.wishlist.filter(item => item.id !== product.id);
    this.saveWishlist();
  }


  isInWishlist(product: Product): boolean {
    return this.wishlist.some(item => item.id === product.id);
  }
}
