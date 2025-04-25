// src/app/modules/wishlist/wishlist.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistComponent } from './/wishlist/wishlist.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: WishlistComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [WishlistComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class WishlistModule {}
