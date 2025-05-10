// src/app/admin/analytics/admin-analytics.component.ts

import { Component, OnInit } from '@angular/core';
import { AnalyticsService, OrderResponse } from '@core/services/analytics.service';
import { ChartOptions } from 'chart.js';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-analytics',
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.css',
  standalone:false
})
export class AdminAnalyticsComponent implements OnInit {
  totalRevenue = 0;
  topProducts: { name: string; sold: number }[] = [];
  topSellers: { sellerId: number; revenue: number }[] = [];

  productChartData: any;
  sellerChartData: any;

  public chartOptions: ChartOptions<'bar' | 'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
    this.analytics.getAllOrders()
      .pipe(
        map((orders: OrderResponse[]) => {
          // 총 ciro
          this.totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

          // ürün satış adedi
          const prodMap = new Map<string, number>();
          // satıcı gelir
          const sellerMap = new Map<number, number>();

          orders.forEach(o =>
            o.items.forEach(i => {
              prodMap.set(
                i.productName,
                (prodMap.get(i.productName) || 0) + i.quantity
              );
              sellerMap.set(
                i.sellerId,
                (sellerMap.get(i.sellerId) || 0) + i.price * i.quantity
              );
            })
          );

          this.topProducts = Array.from(prodMap.entries())
            .map(([name, sold]) => ({ name, sold }))
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5);

          this.topSellers = Array.from(sellerMap.entries())
            .map(([sellerId, revenue]) => ({ sellerId, revenue }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

          // chart veri seti
          this.productChartData = {
            labels: this.topProducts.map(p => p.name),
            datasets: [{ data: this.topProducts.map(p => p.sold), label: 'Adet' }]
          };

          this.sellerChartData = {
            labels: this.topSellers.map(s => `Seller ${s.sellerId}`),
            datasets: [{
              data: this.topSellers.map(s => s.revenue),
              label: 'Gelir'
            }]
          };
        })
      )
      .subscribe();
  }
}
