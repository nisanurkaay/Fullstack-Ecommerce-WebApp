// src/app/modules/logistics/logistics.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogisticsRoutingModule } from './logistics-routing.module';
import { LogisticsDashboardComponent } from './logistics-dashboard/logistics-dashboard.component';

@NgModule({
  declarations: [
    LogisticsDashboardComponent
  ],
  imports: [
    CommonModule,
    LogisticsRoutingModule
  ]
})
export class LogisticsModule {}
