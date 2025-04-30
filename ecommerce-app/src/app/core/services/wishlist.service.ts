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

  // Wishlist'i yerel depolamaya kaydetmek
  private saveWishlist(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    this.wishlistSubject.next(this.wishlist); // Observable güncelle
  }

  // Wishlist'i yerel depolamadan almak
  private loadWishlist(): void {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      this.wishlist = JSON.parse(storedWishlist);
      this.wishlistSubject.next(this.wishlist); // Observable başlat
    }
  }

  // Wishlist observable'ını döndür
  getWishlist() {
    return this.wishlistSubject.asObservable();
  }

  // Wishlist'e ürün eklemek
  addToWishlist(product: Product): void {
    if (!this.isInWishlist(product)) {
      this.wishlist.push(product);
      this.saveWishlist();
    }
  }

  // Wishlist'ten ürün çıkarmak
  removeFromWishlist(product: Product): void {
    this.wishlist = this.wishlist.filter(item => item.id !== product.id);
    this.saveWishlist();
  }

  // Wishlist'te olup olmadığını kontrol etme
  isInWishlist(product: Product): boolean {
    return this.wishlist.some(item => item.id === product.id);
  }
}
