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

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'order-mgmt', component: OrderMgmtComponent },
      { path: 'product-mgmt', component: ProductMgmtComponent },
      { path: 'user-mgmt', component: UserMgmtComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
