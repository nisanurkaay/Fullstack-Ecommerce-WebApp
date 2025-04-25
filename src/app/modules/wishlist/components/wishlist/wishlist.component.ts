// src/app/modules/wishlist/components/wishlist.component.ts
import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  standalone:false,
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: Product[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistService.getWishlist().subscribe(data => {
      this.wishlist = data;
    });
  }

  remove(id: number): void {
    this.wishlistService.removeFromWishlist(id);
  }
}
