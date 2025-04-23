import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';
import { ProductMgmtComponent } from './product-mgmt/product-mgmt.component';
import { OrderMgmtComponent } from './order-mgmt/order-mgmt.component';


@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    UserMgmtComponent,
    ProductMgmtComponent,
    OrderMgmtComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
