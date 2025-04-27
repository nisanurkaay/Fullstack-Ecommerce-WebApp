// src/app/modules/wishlist/wishlist.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module'; // Navbar, ProductCard, MatButton vs.
import { WishlistRoutingModule } from './wishlist-routing.module';
import { WishlistComponent } from './wishlist/wishlist.component';

@NgModule({
  declarations: [WishlistComponent],
  imports: [
    CommonModule,
    WishlistRoutingModule,
    SharedModule,
    MatButtonModule,
    RouterModule
  ]
})
export class WishlistModule {}
