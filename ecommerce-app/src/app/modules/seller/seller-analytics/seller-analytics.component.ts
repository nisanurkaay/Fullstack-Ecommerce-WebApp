// src/app/seller/analytics/seller-analytics.component.ts
import { Component, OnInit } from '@angular/core';
import { AnalyticsService, OrderResponse, CategorySold } from '@core/services/analytics.service';
import { ChartOptions } from 'chart.js';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-seller-analytics',
  templateUrl: './seller-analytics.component.html',
  styleUrl: './seller-analytics.component.css',
  standalone:false
})
export class SellerAnalyticsComponent implements OnInit {
  totalRevenue = 0;
  totalProducts = 0;
  lowStockCount = 0;
  returnRate = 0;
  topCategories: CategorySold[] = [];

  productChartData: any;
  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { ticks: { maxRotation: 0 } }, y: { beginAtZero: true } },
    plugins: { legend: { position: 'top' } }
  };

  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
     console.log('fetchettiğim tüm veriler:', {
    orders$: this.analytics.getAllOrders(),
    low$: this.analytics.getLowStockCount(),
    rate$: this.analytics.getReturnRate(),
    cats$: this.analytics.getTopCategories(5)
  });
    forkJoin({
      orders: this.analytics.getAllOrders(),
      lowStock: this.analytics.getLowStockCount(),
      rate: this.analytics.getReturnRate(),
      categories: this.analytics.getTopCategories(5)
    })
    .pipe(
      map(({ orders, lowStock, rate, categories }) => {
        // Revenue & product count
        this.totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const prodMap = new Map<string, number>();
        orders.forEach(o =>
          o.items.forEach(i => {
            prodMap.set(i.productName, (prodMap.get(i.productName) || 0) + i.quantity);
          })
        );
        this.totalProducts = prodMap.size;

        // Low stock & return rate & categories
        this.lowStockCount = lowStock;
        this.returnRate = rate;
        this.topCategories = categories;

        // Chart data (best selling 5 products by quantity)
        const top5 = Array.from(prodMap.entries())
          .map(([name, sold]) => ({ name, sold }))
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 5);

        this.productChartData = {
          labels: top5.map(p => p.name),
          datasets: [{ data: top5.map(p => p.sold), label: 'Adet' }]
        };
      })
    )
    .subscribe();
  }
}
