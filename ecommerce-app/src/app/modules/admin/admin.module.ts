import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CategoryMgmtComponent } from './category-mgmt/category-mgmt.component';
import { OrderMgmtComponent } from './order-mgmt/order-mgmt.component';
import { ProductMgmtComponent } from './product-mgmt/product-mgmt.component';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';
import { FormsModule } from '@angular/forms';
import { AdminAnalyticsComponent } from './admin-analytics/admin-analytics.component';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

// Chart.js’in tüm registerable öğelerini kaydet
Chart.register(...registerables);
@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    OrderMgmtComponent,
    ProductMgmtComponent,
    UserMgmtComponent,
    CategoryMgmtComponent,
    AdminAnalyticsComponent
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
    MatSlideToggleModule,
    MatIconModule,
    FormsModule,
    BaseChartDirective
  ]
})
export class AdminModule {}
