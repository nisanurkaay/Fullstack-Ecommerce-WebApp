// src/app/modules/wishlist/wishlist.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module'; // Navbar, ProductCard, MatButton vs.
import { WishlistRoutingModule } from './wishlist-routing.module';
import { WishlistComponent } from './wishlist/wishlist.component';
import { VariantSelectorDialogComponent } from './variant-selector-dialog/variant-selector-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [WishlistComponent, VariantSelectorDialogComponent],
  imports: [
    CommonModule,
    WishlistRoutingModule,
    MatDialogModule,
    FormsModule,

    MatButtonModule,
    MatSnackBarModule,
    RouterModule
  ]
})
export class WishlistModule {}
