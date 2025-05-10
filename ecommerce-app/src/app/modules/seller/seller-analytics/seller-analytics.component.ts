// src/app/seller/analytics/seller-analytics.component.ts
import { Component, OnInit } from '@angular/core';
import { AnalyticsService, OrderResponse } from '@core/services/analytics.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-seller-analytics',
  templateUrl: './seller-analytics.component.html',
  standalone:false
})
export class SellerAnalyticsComponent implements OnInit {
  totalRevenue = 0;
  productChartData: any;

  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
    this.analytics.getAllOrders().pipe(
      map(orders => {
        // ROLE_SELLER ile çağırıldığında order.items sadece bu satıcınınkiler olur
        this.totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

        const prodMap = new Map<string, number>();
        orders.forEach(o =>
          o.items.forEach(i => {
          prodMap.set(i.productName, (prodMap.get(i.productName)||0) + i.quantity);
           console.log('API’dan dönen orders:', orders);
          })
        );
        const top = Array.from(prodMap.entries())
          .map(([name, sold]) => ({ name, sold }))
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 5);

        this.productChartData = {
          labels: top.map(p => p.name),
          datasets: [{ data: top.map(p => p.sold), label: 'Adet' }]
        };
      })
    ).subscribe();
  }
}
