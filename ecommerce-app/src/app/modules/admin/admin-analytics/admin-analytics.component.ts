// src/app/admin/analytics/admin-analytics.component.ts
import { Component, OnInit } from '@angular/core';
import { AnalyticsService, OrderResponse, ProductResponse } from '@core/services/analytics.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-analytics',
  templateUrl: './admin-analytics.component.html',
  standalone:false
})
export class AdminAnalyticsComponent implements OnInit {
  totalRevenue = 0;
  topProducts: { name: string; sold: number }[] = [];
  topSellers: { sellerId: number; revenue: number }[] = [];

  // chart data
  productChartData: any;
  sellerChartData: any;

  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
    // 1) Tüm siparişleri çek
    this.analytics.getAllOrders().pipe(
      map(orders => {
        // toplam geliri hesapla
        this.totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

        // ürün bazında toplam adet
        const prodMap = new Map<string, number>();
        // satıcı bazında toplam gelir
        const sellerMap = new Map<number, number>();

        orders.forEach(o =>
          o.items.forEach(i => {
            prodMap.set(i.productName, (prodMap.get(i.productName)||0) + i.quantity);
            sellerMap.set(i.sellerId, (sellerMap.get(i.sellerId)||0) + i.price * i.quantity);
          })
        );

        // en çok satan ilk 5 ürün
        this.topProducts = Array.from(prodMap.entries())
          .map(([name, sold]) => ({ name, sold }))
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 5);

        // en çok gelir getiren ilk 5 satıcı
        this.topSellers = Array.from(sellerMap.entries())
          .map(([sellerId, revenue]) => ({ sellerId, revenue }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        // chart.js verisine dönüştür
        this.productChartData = {
          labels: this.topProducts.map(p => p.name),
          datasets: [{ data: this.topProducts.map(p => p.sold), label: 'Adet' }]
        };
        this.sellerChartData = {
          labels: this.topSellers.map(s => 'Seller '+s.sellerId),
          datasets: [{ data: this.topSellers.map(s => s.revenue), label: 'Gelir' }]
        };
      })
    ).subscribe();
  }
}
