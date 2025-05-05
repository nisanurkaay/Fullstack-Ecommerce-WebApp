

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  // /products              → product list
  { path: '', component: ProductListComponent },

  // /products/:id          → product detail
  { path: ':id', component: ProductDetailComponent },

  {
    path: 'products/:productId/variant/:variantId',
    component: ProductDetailComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
