import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AnalyticsComponent } from './analytics/analytics.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { SellerRoutingModule } from './seller-routing.module';
import { SellerComponent } from './seller.component';
import { AddProductComponent } from './add-product/add-product.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';         // (opsiyonel, ikon kullanıyorsan)
import { MatSnackBarModule } from '@angular/material/snack-bar'; // (opsiyonel, bildirim için)
import { ReactiveFormsModule , FormsModule} from '@angular/forms';
import { EditProductComponent } from './edit-product/edit-product.component';
@NgModule({
  declarations: [
    SellerComponent,
    SellerDashboardComponent,
    MyProductsComponent,
    MyOrdersComponent,
    AnalyticsComponent,
    AddProductComponent,
    EditProductComponent
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    MatFormFieldModule,

    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,         // (opsiyonel, ikon kullanıyorsan)
    MatSnackBarModule,    // (opsiyonel, bildirim için)
    ReactiveFormsModule

  ]
})
export class SellerModule {}
