// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [

  { path: 'login',    redirectTo: '/auth/login',    pathMatch: 'full' },
  { path: 'register', redirectTo: '/auth/register', pathMatch: 'full' },


  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./modules/cart/cart.module').then(m => m.CartModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./modules/order/order.module').then(m => m.OrderModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard]
  },

  // ana sayfa + wildcard
  { path: '',     redirectTo: '/products', pathMatch: 'full' },
  { path: '**',   redirectTo: '/products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
