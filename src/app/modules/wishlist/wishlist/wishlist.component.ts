import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  standalone: false,
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: Product[] = [];

  constructor(private wishlistService: WishlistService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.wishlistService.getWishlist().subscribe(data => {
      this.wishlist = data;
    });
  }

  // remove methodu artık Product alacak
  remove(product: Product): void {
    this.wishlistService.removeFromWishlist(product);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    // 2 saniyelik bir onay mesajı gösterelim:
    this.snackBar.open('Added to cart ✓', 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
