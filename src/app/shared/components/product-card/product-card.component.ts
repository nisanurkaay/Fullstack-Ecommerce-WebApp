import { Component, Input, OnInit } from '@angular/core';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  isInWishlist: boolean = false;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    // Wishlist'te olup olmadığını kontrol et
    this.isInWishlist = this.wishlistService.isInWishlist(this.product);
  }

  toggleWishlist(): void {
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
    this.isInWishlist = !this.isInWishlist;
  }
}
