import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AnalyticsComponent } from './analytics/analytics.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { SellerRoutingModule } from './seller-routing.module';
import { SellerComponent } from './seller.component';
@NgModule({
  declarations: [
    SellerComponent,
    SellerDashboardComponent,
    MyProductsComponent,
    MyOrdersComponent,
    AnalyticsComponent
  ],
  imports: [
    CommonModule,
    SellerRoutingModule
  ]
})
export class SellerModule {}
