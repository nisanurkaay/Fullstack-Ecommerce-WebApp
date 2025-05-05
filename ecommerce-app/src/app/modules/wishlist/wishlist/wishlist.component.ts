import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { VariantSelectorDialogComponent } from '../variant-selector-dialog/variant-selector-dialog.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  standalone: false
})
export class WishlistComponent implements OnInit {
  wishlist: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.wishlistService.getWishlist().subscribe(data => {
      this.wishlist = data;
    });
  }

  remove(product: Product): void {
    this.wishlistService.removeFromWishlist(product);
  }

  addToCart(product: Product): void {
    if (product.variants?.length) {
      const dialogRef = this.dialog.open(VariantSelectorDialogComponent, {
        width: '420px',
        data: { product },
        panelClass: 'variant-dialog-panel'
      });

      dialogRef.afterClosed().subscribe((selectedVariant) => {
        if (selectedVariant) {
          this.cartService.addToCart(product, selectedVariant.color, selectedVariant.size);
          this.showSnackbar('Added to cart ✓');
        }
      });
    } else {
      this.cartService.addToCart(product);
      this.showSnackbar('Added to cart ✓');
    }
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
