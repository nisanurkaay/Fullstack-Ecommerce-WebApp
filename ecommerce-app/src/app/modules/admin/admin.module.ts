import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { OrderMgmtComponent } from './order-mgmt/order-mgmt.component';
import { ProductMgmtComponent } from './product-mgmt/product-mgmt.component';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';
import { CategoryMgmtComponent } from './category-mgmt/category-mgmt.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    OrderMgmtComponent,
    ProductMgmtComponent,
    UserMgmtComponent,
    CategoryMgmtComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule

  ]
})
export class AdminModule {}
