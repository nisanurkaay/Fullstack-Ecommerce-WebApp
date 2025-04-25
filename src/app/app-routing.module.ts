import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'products', loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule) },
  {
    path: 'wishlist',
    loadChildren: () => import('./modules/wishlist/wishlist.module').then(m => m.WishlistModule)
  },

  { path: 'cart', loadChildren: () => import('./modules/cart/cart.module').then(m => m.CartModule), canActivate: [AuthGuard] },
  { path: 'orders', loadChildren: () => import('./modules/order/order.module').then(m => m.OrderModule), canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
