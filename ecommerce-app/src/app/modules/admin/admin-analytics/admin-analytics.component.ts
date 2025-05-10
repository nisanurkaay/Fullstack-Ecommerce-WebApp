// src/app/admin/analytics/admin-analytics.component.ts
import { Component, OnInit } from '@angular/core';
import { AnalyticsService, OrderResponse, TopSeller,CategorySold } from '@core/services/analytics.service'; // ➌ TopSeller import
import { ChartOptions } from 'chart.js';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-analytics',
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.css',
  standalone:false
})
export class AdminAnalyticsComponent implements OnInit {
  totalRevenue = 0;
  topProducts: { name: string; sold: number }[] = [];
  topSellers: TopSeller[] = []; // ➍
   topCategories: CategorySold[] = [];

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
  forkJoin({
    orders:        this.analytics.getAllOrders(),
    topSellers:    this.analytics.getTopSellers(5),
    topCategories: this.analytics.getTopCategories(5)   // ➊
  }).subscribe(({ orders, topSellers, topCategories }) => {  // ➋
    // 1) toplam revenue
    this.totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    // 2) ürün satışları
    const prodMap = new Map<string, number>();
    orders.forEach(o =>
      o.items.forEach(i =>
        prodMap.set(i.productName, (prodMap.get(i.productName)||0) + i.quantity)
      )
    );
    this.topProducts = Array.from(prodMap.entries())
      .map(([name, sold]) => ({ name, sold }))
      .sort((a,b) => b.sold - a.sold)
      .slice(0,5);

    // 3) satıcı gelirleri (backend’den geliyor)
    this.topSellers = topSellers;

    // 4) kategori verisini yakala
    this.topCategories = topCategories;                    // ➌

    // 5) chart verisi
    this.productChartData = {
      labels: this.topProducts.map(p => p.name),
      datasets: [{ data: this.topProducts.map(p => p.sold), label: 'Adet' }]
    };
    this.sellerChartData = {
      labels: this.topSellers.map(s => s.sellerName),
      datasets: [{ data: this.topSellers.map(s => s.revenue), label: 'Gelir' }]
    };
  });
}

}
