import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
import { OrderComponent } from './order.component';


@NgModule({
  declarations: [
    OrderComponent,
    OrderHistoryComponent,
    OrderTrackingComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
