// src/app/modules/logistics/logistics-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogisticsDashboardComponent } from './logistics-dashboard/logistics-dashboard.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LogisticsDashboardComponent,
    canActivate: [AuthGuard],
    data: { allowedRoles: ['ROLE_LOGISTICS'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogisticsRoutingModule {}
