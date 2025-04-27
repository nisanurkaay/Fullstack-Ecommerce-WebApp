import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon'; // yıldızlar için
import { MatTabsModule } from '@angular/material/tabs'; // sekmeler için
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
    MatIconModule
  ]
})
export class ProductModule { }
