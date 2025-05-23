import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SellerGuard } from '../../core/guards/seller.guard';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { SellerComponent } from './seller.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { SellerAnalyticsComponent } from './seller-analytics/seller-analytics.component';

const routes: Routes = [{
  path: '',
  component: SellerComponent,
  canActivate: [AuthGuard, SellerGuard],
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: MyProductsComponent },
    { path: 'products',  component: MyProductsComponent },
    { path: 'orders',    component: MyOrdersComponent },
    { path: 'analytics', component: SellerAnalyticsComponent },
    { path: 'add-product', component: AddProductComponent },
    { path: 'edit-product/:id', component: EditProductComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule {}
