// src/app/modules/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../core/guards/admin.guard';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin.component';
import { OrderMgmtComponent } from './order-mgmt/order-mgmt.component';
import { ProductMgmtComponent } from './product-mgmt/product-mgmt.component';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';
import { CategoryMgmtComponent } from './category-mgmt/category-mgmt.component';
import { AdminAnalyticsComponent } from './admin-analytics/admin-analytics.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', redirectTo: 'ProductMgmtComponent', pathMatch: 'full' },
      { path: 'dashboard', component: ProductMgmtComponent },
      {path:'analytics', component:AdminAnalyticsComponent},
      { path: 'order-mgmt', component: OrderMgmtComponent },
      { path: 'product-mgmt', component: ProductMgmtComponent },
      { path: 'user-mgmt', component: UserMgmtComponent },
      { path: 'category-mgmt', component: CategoryMgmtComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
