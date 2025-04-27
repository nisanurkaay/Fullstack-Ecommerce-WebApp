import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'; // yıldızlar için
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs'; // sekmeler için
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductRoutingModule } from './product-routing.module';
import { ReviewCardComponent } from './review-card/review-card.component';
import { ReviewListComponent } from './review-list/review-list.component'; // SharedModule'ü import edidc  // ← Ekle
import { SearchComponent } from './search/search.component';



@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    SearchComponent,
    ReviewCardComponent,
    ReviewListComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    MatTabsModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTabsModule,
    MatDividerModule,
    RouterModule
  ],
  exports: [
    ProductDetailComponent
  ]
})
export class ProductModule { }
