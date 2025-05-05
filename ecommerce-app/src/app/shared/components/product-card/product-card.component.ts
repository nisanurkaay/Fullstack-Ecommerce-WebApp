// src/app/shared/components/product-card/product-card.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  isInWishlist = false;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isInWishlist = this.wishlistService.isInWishlist(this.product);

    if (this.product.variants && this.product.variants.length > 0) {
      const prices = this.product.variants.map(v => v.price);
      this.product.price = Math.min(...prices);  // 💡 En düşük varyant fiyatını ata
    }
  }


  toggleWishlist(): void {
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
    this.isInWishlist = !this.isInWishlist;
  }

  addToCart(): void {
    this.cartService.addToCart(this.product);
  }

  // İstersen ürüne tıklanınca detay sayfasına yönlendirme de ekleyebilirsin
  viewDetails(): void {
    this.router.navigate(['/products', this.product.id]);
  }
}
