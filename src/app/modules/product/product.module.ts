import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SearchComponent } from './search/search.component';
import { SharedModule } from '../../shared/shared.module';
import { ReviewCardComponent } from './review-card/review-card.component';
import { ReviewListComponent } from './review-list/review-list.component';  // SharedModule'ü import edin

import { MatTabsModule } from '@angular/material/tabs';

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
    MatTabsModule
  ]
})
export class ProductModule { }
